import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const showSuccessToast = (message, options = {}) => {
    const customId = 'success-id'
    toast.success(message, {
        position: toast.POSITION.BOTTOM_LEFT,
        toastId: options.toastId ? customId : undefined,
        ...options
    })
}

export const showErrorToast = (message, options = {}) => {
    const customId = 'error-id'
    toast.error(message, {
        position: toast.POSITION.BOTTOM_LEFT,
        toastId: customId,
        ...options
    })
}

export const showInfoToast = (message, options = {}) => {
    const customId = 'info-id'
    toast.info(message, {
        position: toast.POSITION.BOTTOM_LEFT,
        toastId: customId,
        ...options
    })
}

export const showWarningToast = (message, options = {}) => {
    const customId = 'warning-id'
    toast.warning(message, {
        position: toast.POSITION.BOTTOM_LEFT,
        toastId: customId,
        ...options
    })
}

export const showToast = (message, options = {}) => {
    const customId = 'toast-id'
    toast(message, {
        position: toast.POSITION.BOTTOM_LEFT,
        toastId: customId,
        ...options
    })
}