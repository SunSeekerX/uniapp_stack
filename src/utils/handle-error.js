import { toast } from '@limm/utools'

/**
 * Api请求出错
 * @param { Error } 错误对象
 * @returns void
 */
function handleApiRequestException(res) {
  console.warn('Capture request exception >>>', res)
  toast(res.msg)
}

/**
 * 程序出错
 * @param { Error } 错误对象
 * @returns void
 */
function handleApplicationException(e) {
  console.error(e)
}

/**
 * 请求失败
 * @param { Error } 错误对象
 */
function handleRequestFail(res) {
  console.warn('Capture request fail >>>', res)
  toast(res.msg)
}

export {
  // Api请求出错
  handleApiRequestException,
  // 程序出错
  handleApplicationException,
  // 请求失败
  handleRequestFail,
}
