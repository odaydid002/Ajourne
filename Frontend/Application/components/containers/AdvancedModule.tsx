import CalculatorModule from './CalculatorModule'

export default function AdvancedModule(props: any) {
  // Thin wrapper kept for future advanced-specific UI
  return <CalculatorModule {...props} />
}
