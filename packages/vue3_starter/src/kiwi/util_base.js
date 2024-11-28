import { lodash } from './libs'

export const isValidUrl = urlString => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ) // validate fragment locator
  return !!urlPattern.test(urlString)
}

export const formatAddress = (str = '', prefixLength = 6, suffixLength = 4) => {
  const regex = new RegExp(`(.{${prefixLength}}).*(.{${suffixLength}})`)
  return str.replace(regex, '$1...$2')
}

// export const message = {
//   success: message =>
//     ElementPlus.ElMessage({
//       type: 'success',
//       message,
//     }),
//   warning: message =>
//     ElementPlus.ElMessage({
//       type: 'warning',
//       message,
//     }),
//   info: message =>
//     ElementPlus.ElMessage({
//       type: 'info',
//       message,
//     }),
//   error: message =>
//     ElementPlus.ElMessage({
//       type: 'error',
//       message,
//     }),
// }

// export const onCopyToClipboard = (text, successCb, failCb) => {
//   const flag = copyToClipboard(text)
//   if (flag) {
//     if (typeof successCb === 'function') {
//       successCb()
//     } else {
//       message.success(`复制成功: ${text}`)
//     }
//   } else {
//     failCb && failCb()
//   }
//   return flag
// }

export const sleep = timeout =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })

/**
 * 移除对象中的空值
 * @param {Object} obj - 对象
 * @param {{ removeEmpty?: boolean, removeNil?: boolean, mutate?: boolean }} [options={}] - 配置项
 * @returns {Object} 处理后的对象
 */
// @ts-ignore
export const cleanObject = (obj, options = {}) => {
  const { removeEmpty = false, removeNil = true, mutate = false } = options

  const shouldRemove = value => {
    if (removeNil && lodash.isNil(value)) return true
    if (removeEmpty && value === '') return true
    return false
  }

  const cleaner = object => {
    return lodash.transform(object, (result, value, key) => {
      if (shouldRemove(value)) {
        return
      }

      if (lodash.isObjectLike(value)) {
        value = cleaner(value)
      }

      if (lodash.isObjectLike(value) && lodash.isEmpty(value)) {
        return
      }

      result[key] = value
    })
  }

  return mutate ? cleaner(obj) : cleaner(lodash.cloneDeep(obj))
}
