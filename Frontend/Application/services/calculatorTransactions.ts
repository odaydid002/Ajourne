import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { getDatabase } from '@/database';
import { calculatorService } from './calculatorService';
import { publisherService } from './publisherService';
import { semesterService } from './semesterService';
import { unitService } from './unitService';
import { moduleService } from './moduleService';
import i18n from '@/i18n';

export interface CalculatorData {
  id: string;
  type: 'simple' | 'advanced';
  mode: 'single' | 'dual';
  title?: string;
  description?: string;
  univ: string;
  lvl: string;
  spec: string;
  modules: any[];
  units: any[];
}

/**
 * Transform module data to flatten weights object
 * Converts { weights: { exam, td, tp } } to { weight_exam, weight_td, weight_tp }
 */
const transformModuleWeights = (module: any) => {
  return {
    ...module,
    weight_exam: module.weights?.exam ?? module.weight_exam ?? 0,
    weight_td: module.weights?.td ?? module.weight_td ?? 0,
    weight_tp: module.weights?.tp ?? module.weight_tp ?? 0,
  };
};

/**
 * Transform units with flattened module weights
 */
const transformUnitsWeights = (units: any[]) => {
  return units.map((unit: any) => ({
    ...unit,
    modules: Array.isArray(unit.modules)
      ? unit.modules.map(transformModuleWeights)
      : [],
  }));
};

/**
 * Transform modules with flattened weights
 */
const transformModulesWeights = (modules: any[]) => {
  return modules.map(transformModuleWeights);
};

// Normalize module object shape to UI expected keys (camelCase, weights object)
const normalizeModule = (m: any) => {
  if (!m || typeof m !== 'object') return m;
  const mod = { ...m } as any;
  // hasTd / hasTp
  if (mod.has_td !== undefined) { mod.hasTd = !!mod.has_td; }
  if (mod.hasTp === undefined && mod.hasTp === undefined && mod.hasTd === undefined) {
    // try camelCase keys
    if (mod.hasTd === undefined && mod.has_td === undefined) mod.hasTd = !!mod.hasTd;
  }
  if (mod.has_tp !== undefined) { mod.hasTp = !!mod.has_tp; }

  // coeff / credit
  if (mod.coeff === undefined && mod.coef !== undefined) mod.coeff = mod.coef;

  // weights normalization: weight_exam, weight_td, weight_tp -> weights: { exam, td, tp }
  let exam = mod.weight_exam ?? mod.weightExam ?? mod.weights?.exam ?? mod.exam_weight ?? mod.weight?.exam ?? mod.weight;
  let td = mod.weight_td ?? mod.weightTd ?? mod.weights?.td ?? mod.td_weight;
  let tp = mod.weight_tp ?? mod.weightTp ?? mod.weights?.tp ?? mod.tp_weight;

  // Normalize numeric values: accept numbers or numeric strings (e.g. "0.50" or "50")
  const normalizeVal = (v: any) => {
    if (v === null || v === undefined) return undefined;
    // coerce numeric strings to numbers
    let num: number | undefined;
    if (typeof v === 'number') num = v;
    else if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) num = Number(v);
    if (typeof num === 'number') {
      return num > 1 ? num / 100 : num;
    }
    return undefined;
  };

  // Prefer explicit DB columns (weight_exam/weight_td/weight_tp) when present
  const examFromCols = normalizeVal(mod.weight_exam ?? mod.weightExam ?? mod.exam_weight ?? mod.weight?.exam ?? mod.weight);
  const tdFromCols = normalizeVal(mod.weight_td ?? mod.weightTd ?? mod.td_weight);
  const tpFromCols = normalizeVal(mod.weight_tp ?? mod.weightTp ?? mod.tp_weight);

  exam = examFromCols ?? normalizeVal(exam) ?? normalizeVal(mod.weights?.exam) ?? undefined;
  td = tdFromCols ?? normalizeVal(td) ?? normalizeVal(mod.weights?.td) ?? undefined;
  tp = tpFromCols ?? normalizeVal(tp) ?? normalizeVal(mod.weights?.tp) ?? undefined;

  // Debug final normalized weights
  try {
  } catch (e) {}

  // Provide sensible defaults when weights are missing
  if (!mod.hasTd && !mod.hasTp) {
    exam = (typeof exam === 'number') ? exam : 1;
    td = 0;
    tp = 0;
  } else if (mod.hasTd && !mod.hasTp) {
    exam = (typeof exam === 'number') ? exam : 0.6;
    td = (typeof td === 'number') ? td : 0.4;
    tp = 0;
  } else if (!mod.hasTd && mod.hasTp) {
    exam = (typeof exam === 'number') ? exam : 0.6;
    td = 0;
    tp = (typeof tp === 'number') ? tp : 0.4;
  } else {
    // has both
    exam = (typeof exam === 'number') ? exam : 0.6;
    td = (typeof td === 'number') ? td : 0.2;
    tp = (typeof tp === 'number') ? tp : 0.2;
  }

  // Ensure sane fallback to avoid NaNs
  exam = typeof exam === 'number' ? exam : 0;
  td = typeof td === 'number' ? td : 0;
  tp = typeof tp === 'number' ? tp : 0;

  mod.weights = { exam, td, tp };

  return mod;
}

/**
 * Save calculator to local SQLite database
 * Inserts calculator, semesters, modules/units structure
 */
export const saveCalculatorLocally = async (
  calculatorData: CalculatorData,
  deviceId: string
): Promise<boolean> => {
  try {
    // Get database instance (will initialize if needed)
    const database = await getDatabase();

    // Validate input data
    if (!calculatorData.id || !deviceId) {
      console.error('Missing required data: id or deviceId');
      return false;
    }

    if (!Array.isArray(calculatorData.modules)) {
      calculatorData.modules = [];
    }
    if (!Array.isArray(calculatorData.units)) {
      calculatorData.units = [];
    }

    // Transform weights to flat structure (weights.exam -> weight_exam)
    const transformedModules = transformModulesWeights(calculatorData.modules);
    const transformedUnits = transformUnitsWeights(calculatorData.units);

    const now = new Date().toISOString();

    // Insert calculator
    
    if (!database || !database.runAsync) {
      console.error('Database not properly initialized: database.runAsync is not available');
      return false;
    }

    await database.runAsync(
      `INSERT INTO calculators (id, device_id, type, title, description, published, speciality, level, university_name, created_at, updated_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        calculatorData.id,
        deviceId,
        calculatorData.type,
        calculatorData.title || `${calculatorData.spec} - ${calculatorData.mode === 'single' ? 'S1' : 'S1 & S2'}`,
        calculatorData.description || `Calculator for ${calculatorData.univ}`,
        0,
        calculatorData.spec,
        calculatorData.lvl,
        calculatorData.univ,
        now,
        now,
        0,
      ]
    );

    // Insert semesters based on mode
    const semesters = calculatorData.mode === 'dual' ? ['s1', 's2'] : ['s1'];
    
    for (const sem of semesters) {
      const semesterId = uuid.v4().toString();
      await database.runAsync(
        `INSERT INTO semesters (id, calculator_id, name, created_at, updated_at, synced)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [semesterId, calculatorData.id, sem, now, now, 0]
      );

      // Insert units/modules for this semester
      if (calculatorData.type === 'advanced') {
        const semesterUnits = transformedUnits.filter(
          (u: any) => (u.semester ?? 's1') === sem
        );
        
        for (const unit of semesterUnits) {
          const unitId = (unit.id || uuid.v4().toString());
          await database.runAsync(
            `INSERT INTO units (id, semester_id, title, created_at, updated_at, synced)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [unitId, semesterId, unit.title, now, now, 0]
          );

          // Insert modules for this unit
          if (Array.isArray(unit.modules)) {
            for (const module of unit.modules) {
              await database.runAsync(
                `INSERT INTO modules (id, semester_id, unit_id, name, coeff, has_td, has_tp, credit, weight_exam, weight_td, weight_tp, created_at, updated_at, synced)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  module.id,
                  semesterId,
                  unitId,
                  module.name,
                  module.coeff || 0,
                  module.hasTd ? 1 : 0,
                  module.hasTp ? 1 : 0,
                  module.credit || 0,
                  module.weight_exam || 0,
                  module.weight_td || 0,
                  module.weight_tp || 0,
                  now,
                  now,
                  0,
                ]
              );
            }
          }
        }
      } else {
        // Simple mode: insert modules directly
        const semesterModules = transformedModules.filter(
          (m: any) => (m.semester ?? 's1') === sem
        );
        
        for (const module of semesterModules) {
          await database.runAsync(
            `INSERT INTO modules (id, semester_id, unit_id, name, coeff, has_td, has_tp, created_at, updated_at, synced)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              module.id,
              semesterId,
              null,
              module.name,
              module.coeff || 0,
              module.hasTd ? 1 : 0,
              module.hasTp ? 1 : 0,
              now,
              now,
              0,
            ]
          );
        }
      }
    }

    return true;
  } catch (error: any) {
    console.error('Error saving calculator locally:', error);
    console.error('Error details:', error?.message || JSON.stringify(error));
    return false;
  }
};

/**
 * Publish calculator via API
 * Checks and registers publisher on backend before publishing
 */
export const publishCalculator = async (
  calculatorData: CalculatorData,
  deviceId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Transform weights to flat structure (weights.exam -> weight_exam)
    const transformedModules = transformModulesWeights(calculatorData.modules);
    const transformedUnits = transformUnitsWeights(calculatorData.units);

    // Transform the calculator data for API
    const transformedData = {
      ...calculatorData,
      modules: transformedModules,
      units: transformedUnits,
    };

    // Get or generate publisher ID
    let publisherId = await AsyncStorage.getItem('publisher-id');
    
    if (!publisherId) {
      // Generate new publisher ID if not exists
      publisherId = uuid.v4().toString();
      await AsyncStorage.setItem('publisher-id', publisherId);
    }

    // Try to get or register publisher on backend
    try {
      const existingPublisher = await publisherService.getPublisher(publisherId);
    } catch (checkError: any) {
      // Publisher doesn't exist on backend, try to register it
      const errorMsg = checkError?.toString?.() || '';
      
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        try {
          // Use a valid email format with timestamp to ensure uniqueness
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const email = `pub_${timestamp}_${randomStr}@ajourne.app`;

          const newPublisher = await publisherService.registerPublisher({
            device_id: deviceId,
            name: `Device Publisher ${timestamp}`,
            email: email,
            email_verified: false,
          });
          
          publisherId = newPublisher.id;
          await AsyncStorage.setItem('publisher-id', publisherId);
        } catch (registerError: any) {
          console.error('Failed to register publisher:', registerError);
          const regErrorMsg = registerError?.toString?.() || '';
          
          // Log more details for debugging
          console.error('Registration error details:', {
            status: registerError?.response?.status,
            statusText: registerError?.response?.statusText,
            data: registerError?.response?.data,
            message: registerError?.message,
          });

          return {
            success: false,
            message: `Failed to register as a publisher. ${
              regErrorMsg.includes('409') 
                ? i18n.t('calculators.errors.alreadyRegistered')
                : i18n.t('calculators.errors.publisherBackendError')
            }`,
          };
        }
      } else {
        console.error('Unexpected error checking publisher:', checkError);
        console.error('Error details:', {
          status: checkError?.response?.status,
          message: checkError?.message,
          toString: errorMsg,
        });
        throw checkError;
      }
    }

    // Prepare the full calculator structure for the API
    const calculatorPayload = {
      title: transformedData.title || `${transformedData.spec} - ${
        transformedData.mode === 'single' ? 'Semester 1' : 'Semester 1 & 2'
      }`,
      description: transformedData.description || `Calculator for ${transformedData.univ} - Level: ${transformedData.lvl}`,
      type: transformedData.type,
      device_id: deviceId,
      publisher_id: publisherId,
      speciality: transformedData.spec,
      level: transformedData.lvl,
      university_name: transformedData.univ,
      semesters: transformedData.mode === 'dual' ? ['s1', 's2'] : ['s1'],
      modules: transformedData.type === 'simple' ? transformedData.modules : [],
      units: transformedData.type === 'advanced' ? transformedData.units : [],
    };

    // Call API to create calculator
    const response = await calculatorService.createCalculatorAllInOne(
      publisherId,
      calculatorPayload
    );

    if (response?.success || response?.data) {
      return {
        success: true,
        message:
          i18n.t('create.success.published') ||
          'Calculator published successfully!',
      };
    }

    return {
      success: false,
      message:
        response?.message ||
        i18n.t('create.errors.publishFailed') ||
        'Failed to publish calculator',
    };
  } catch (error: any) {
    console.error('Error publishing calculator:', error);
    console.error('Error details:', {
      status: error?.response?.status,
      message: error?.message,
      toString: error?.toString?.(),
    });
    
    return {
      success: false,
      message:
        error?.message ||
        i18n.t('create.errors.publishError') ||
        'An error occurred while publishing',
    };
  }
};

/**
 * Get calculator detail by ID with all associated units and modules
 * First tries online (server), then falls back to local SQLite
 * Returns null if calculator not found
 */
export const getCalculatorDetail = async (
  calculatorId: string,
  deviceId: string
): Promise<{
  calculator: any;
  semesters: any[];
  isOnline: boolean;
} | null> => {
  try {
    // Try API first (online mode)
    try {
      const calculator = await calculatorService.getCalculator(calculatorId);
      if (calculator && calculator.id) {
        // If API returns full structure (semesters/modules/units), use it
        if (calculator.semesters || calculator.units || calculator.modules) {
          return {
            calculator,
            semesters: calculator.semesters || [],
            isOnline: true,
          };
        }

        // Otherwise try to enrich with structure from API (semesters -> units -> modules)
        try {
          const semestersRes = await semesterService.getSemestersByCalculator(calculatorId);
          const semesters = Array.isArray(semestersRes)
            ? semestersRes
            : Array.isArray(semestersRes?.data)
              ? semestersRes.data
              : Array.isArray(semestersRes?.semesters)
                ? semestersRes.semesters
                : [];
          const enrichedSemesters = await Promise.all(
            semesters.map(async (sem: any) => {
              // Try to fetch units for this semester
                try {
                const unitsRes = await unitService.getUnitsBySemester(sem.id);
                const units = Array.isArray(unitsRes)
                  ? unitsRes
                  : Array.isArray(unitsRes?.data)
                    ? unitsRes.data
                    : Array.isArray(unitsRes?.units)
                      ? unitsRes.units
                      : [];
                if (units && units.length > 0) {
                  const enrichedUnits = await Promise.all(
                    units.map(async (unit: any) => {
                        try {
                        const modsRes = await moduleService.getModulesByUnit(unit.id);
                        const mods = Array.isArray(modsRes)
                          ? modsRes
                          : Array.isArray(modsRes?.data)
                            ? modsRes.data
                            : Array.isArray(modsRes?.modules)
                              ? modsRes.modules
                              : [];
                        const normalized = mods.map(normalizeModule);
                        return { ...unit, modules: normalized };
                      } catch (merr) {
                        console.error('[calculatorTransactions] failed to fetch modules for unit', unit.id, merr);
                        return { ...unit, modules: [] };
                      }
                    })
                  );
                  return { ...sem, units: enrichedUnits, modules: [] };
                }
              } catch (uerr) {
                console.error('[calculatorTransactions] failed to fetch units for semester', sem.id, uerr);
              }

              // No units -> fetch modules directly for semester
              try {
                const modsRes = await moduleService.getModulesBySemester(sem.id);
                const mods = Array.isArray(modsRes)
                  ? modsRes
                  : Array.isArray(modsRes?.data)
                    ? modsRes.data
                    : Array.isArray(modsRes?.modules)
                      ? modsRes.modules
                      : [];
                const normalized = mods.map(normalizeModule);
                return { ...sem, units: [], modules: normalized };
              } catch (merr) {
                console.error('[calculatorTransactions] failed to fetch modules for semester', sem.id, merr);
                return { ...sem, units: [], modules: [] };
              }
            })
          );

          if (enrichedSemesters && enrichedSemesters.length > 0) {
            return {
              calculator,
              semesters: enrichedSemesters,
              isOnline: true,
            };
          }
        } catch (apiStructErr) {
          console.error('[calculatorTransactions] API structure enrichment failed:', apiStructErr);
        }

        // If no enrichment available, prefer local DB enrichment (use DB weights/structure when present)
        try {
          const local = await getCalculatorDetailLocally(calculatorId, deviceId);
          if (local && local.semesters && local.semesters.length > 0) {
            // normalize DB modules
            const normalizedSemesters = await Promise.all(
              local.semesters.map(async (sem: any) => {
                const semCopy = { ...sem } as any;
                if (Array.isArray(semCopy.units) && semCopy.units.length > 0) {
                  semCopy.units = semCopy.units.map((u: any) => ({
                    ...u,
                    modules: Array.isArray(u.modules) ? u.modules.map(normalizeModule) : [],
                  }));
                }
                if (Array.isArray(semCopy.modules) && semCopy.modules.length > 0) {
                  semCopy.modules = semCopy.modules.map(normalizeModule);
                }
                return semCopy;
              })
            );

            return {
              calculator: local.calculator,
              semesters: normalizedSemesters,
              isOnline: false,
            };
          }
        } catch (localErr) {
          console.error('[calculatorTransactions] local enrichment failed:', localErr);
        }

        // If no local data, still return API calculator basic info
        return {
          calculator,
          semesters: [],
          isOnline: true,
        };
      }

      // Not found on API -> try local DB
      try {
        const local = await getCalculatorDetailLocally(calculatorId, deviceId);
        if (local) {
          const normalizedSemesters = await Promise.all(
            local.semesters.map(async (sem: any) => {
              const semCopy = { ...sem } as any;
              if (Array.isArray(semCopy.units) && semCopy.units.length > 0) {
                semCopy.units = semCopy.units.map((u: any) => ({
                  ...u,
                  modules: Array.isArray(u.modules) ? u.modules.map(normalizeModule) : [],
                }));
              }
              if (Array.isArray(semCopy.modules) && semCopy.modules.length > 0) {
                semCopy.modules = semCopy.modules.map(normalizeModule);
              }
              return semCopy;
            })
          );

          return {
            calculator: local.calculator,
            semesters: normalizedSemesters,
            isOnline: false,
          };
        }
      } catch (localErr) {
        console.error('[calculatorTransactions] local fallback failed:', localErr);
      }

      return null;
    } catch (apiError) {
      console.error('[calculatorTransactions] API fetch failed:', apiError);
      return null;
    }
  } catch (error: any) {
    console.error('Error fetching calculator detail:', error);
    return null;
  }
};

/**
 * Get calculator detail from local SQLite database
 */
const getCalculatorDetailLocally = async (
  calculatorId: string,
  deviceId?: string
): Promise<{
  calculator: any;
  semesters: any[];
} | null> => {
  try {
    const database = await getDatabase();
    if (!database) {
      console.error('Database not initialized');
      return null;
    }

    // Get calculator
    const calculatorResult = await database.getFirstAsync(
      'SELECT * FROM calculators WHERE id = ?',
      [calculatorId]
    );

    if (!calculatorResult) {
      return null;
    }

    // Get semesters
    const semesterResults = await database.getAllAsync(
      'SELECT * FROM semesters WHERE calculator_id = ? ORDER BY name',
      [calculatorId]
    );

    // Get units and modules for each semester
    const semesters = await Promise.all(
      semesterResults.map(async (sem: any) => {
        // Get units for this semester
        const units = await database.getAllAsync(
          'SELECT * FROM units WHERE semester_id = ? ORDER BY title',
          [sem.id]
        );

        // Get modules for each unit (or directly for this semester if simple mode)
        const semesterData: any = {
          id: sem.id,
          name: sem.name,
          calculator_id: sem.calculator_id,
          units: [],
          modules: [],
        };

        if (units && units.length > 0) {
          // Advanced mode: units with modules
          semesterData.units = await Promise.all(
            units.map(async (unit: any) => {
              const modules = await database.getAllAsync(
                'SELECT * FROM modules WHERE unit_id = ? ORDER BY name',
                [unit.id]
              );
              return {
                id: unit.id,
                title: unit.title,
                semester_id: unit.semester_id,
                modules: modules || [],
              };
            })
          );
        } else {
          // Simple mode: modules directly in semester
          const modules = await database.getAllAsync(
            'SELECT * FROM modules WHERE semester_id = ? AND unit_id IS NULL ORDER BY name',
            [sem.id]
          );
          semesterData.modules = modules || [];
        }

        return semesterData;
      })
    );

    return {
      calculator: calculatorResult,
      semesters: semesters,
    };
  } catch (error: any) {
    console.error('Error fetching calculator detail from local database:', error);
    return null;
  }
};
