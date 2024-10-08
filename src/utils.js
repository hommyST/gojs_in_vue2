const utils = {
  debounce(cb, delay = 1000) {
    let timeout
  
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  },
}

export default utils