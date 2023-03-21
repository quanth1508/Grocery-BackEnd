
class Response {
    constructor(success, message = "", data = null) {
        this.success = success
        this.message = message
        this.data = data
    }

    static defaultSuccess(data = null) {
        return {
            success: true,
            message: "Thành công!",
            data   : data  
        }
    }

    static defaultFailure(data = null) {
        return {
            success: false,
            message: "Thất bại!",
            data   : data  
        }
    }
}

export default Response;