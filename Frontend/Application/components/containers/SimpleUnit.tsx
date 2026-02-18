import CalculatorUnit from './CalculatorUnit'

export default function SimpleUnit(props: any) {
  // Thin wrapper kept for future simple-unit-specific UI
  return <CalculatorUnit {...props} />
}
