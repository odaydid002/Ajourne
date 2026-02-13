import { ReactNode } from "react"
import { TouchableOpacity, View } from "react-native"

interface params{
  children?: ReactNode,
  onPress?:() => void,
  touchable?: boolean,
  bg?: boolean,
  className?: string,
}

export default ({children, onPress, touchable = false, bg=false, className=""}:params) =>{
  
  return touchable?(
    <TouchableOpacity
      activeOpacity={0.8}
      className={`${className} flex-row w-full ${bg?"":"bg-container dark:bg-container-dark"} items-center justify-between rounded-xl`}
      style={{ boxShadow: '3px 4px 4px rgba(0, 0, 0, 0.1)' }}
      onPress={() => onPress && onPress()}
    >
      {children}
    </TouchableOpacity>
  ):(
    <View
      className={`${className} flex-row w-full ${bg?"":"bg-container dark:bg-container-dark"} items-center justify-between rounded-xl`}
      style={{ boxShadow: '3px 4px 4px rgba(0, 0, 0, 0.1)' }}
    >
      {children}
    </View>
  )
}