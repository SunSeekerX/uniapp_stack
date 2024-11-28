import * as ethers from 'ethers'
import * as TronWeb from 'tronweb'
import 'axios'
import { SDKProvider } from '@metamask/sdk'

declare global {
  interface Window {
    ethereum: SDKProvider & {
      isTronLink?: boolean
    }
    tronLink?: ethers.BrowserProvider & {
      tronWeb?: TronWeb.TronWeb
      ready?: boolean
      request?: (args: any) => Promise<any>
      isTronLink?: boolean
    }
    tronWeb?: TronWeb.TronWeb
  }
}

declare module 'axios' {
  export interface AxiosResponse<T = any> {
    code?: number
    msg?: string
    message?: string
  }
}

// // 如果需要，你还可以扩展 TronWeb 的类型
// declare module 'tronweb' {
//   interface TronWeb {
//     // 添加 TronWeb 可能缺少的属性
//     ready?: boolean
//     // 其他自定义属性...
//   }
// }

// 扩展 ExternalProvider 类型
// declare module '@ethersproject/providers' {
//   interface ExternalProvider {
//     isTronLink?: boolean
//   }
// }

export {}
