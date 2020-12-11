exports.send = function  (res, code, data) {

    if (data) {
        res.status(code).send(data)
        return
    }

    let message

    switch (code) {
        case 200: 
            message = 'success'
            break


        case 400:
            message = 'bad request'
            break
        case 401:
            message = 'unauthorised'
            break
        case 402:
            message = 'already exists'
            break
        case 403:
            message = 'user has not linked discord'
            break
        case 404:
            message = 'not found'
            break



        case 500:
            message = 'server error'
            break
    }

    res.status(code).send(message)
}