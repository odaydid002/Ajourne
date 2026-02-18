import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { getDatabase } from '@/database';
import { calculatorService } from './calculatorService';
import { publisherService } from './publisherService';
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
    console.log('Inserting calculator:', calculatorData.id);
    
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
    console.log(`Inserting ${semesters.length} semesters for calculator:`, calculatorData.id);
    
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
      console.log('New publisher ID generated:', publisherId);
    }

    // Try to get or register publisher on backend
    try {
      console.log('Checking if publisher exists on backend...');
      const existingPublisher = await publisherService.getPublisher(publisherId);
      console.log('Publisher already exists:', existingPublisher.id);
    } catch (checkError: any) {
      // Publisher doesn't exist on backend, try to register it
      const errorMsg = checkError?.toString?.() || '';
      
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        console.log('Publisher not found on backend. Creating new publisher...');
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
          console.log('New publisher registered successfully:', publisherId);
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
                ? 'Email already registered. Try again later.'
                : 'Backend error. Please try again later.'
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

    console.log('Publishing calculator with publisherId:', publisherId);

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
    // Try to get from API first (online mode)
    try {
      const calculator = await calculatorService.getCalculator(calculatorId);
      if (calculator && calculator.id) {
        // Get semesters and modules from API
        // You may need to create additional API endpoints for this
        // For now, we'll fetch from local cache
        const localData = await getCalculatorDetailLocally(calculatorId);
        if (localData) {
          return {
            calculator: { ...calculator, ...localData.calculator },
            semesters: localData.semesters,
            isOnline: true,
          };
        }
      }
    } catch (apiError) {
      console.log('Online fetch failed, trying local database...', apiError);
    }

    // Fallback to local SQLite database (offline mode)
    const localData = await getCalculatorDetailLocally(calculatorId, deviceId);
    if (localData) {
      return {
        calculator: localData.calculator,
        semesters: localData.semesters,
        isOnline: false,
      };
    }

    // Not found anywhere
    return null;
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
      console.log('Calculator not found:', calculatorId);
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
