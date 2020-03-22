const {checkSchema, validationResult} = require('express-validator');

const testsValid = checkSchema({
    mm: {
        isInt: {
            options: {
                min: 0,
                max: 100
            }
        },
        toInt: true
    },
    mn: {
        isInt: {
            options: {
                min: 0,
                max: 100
            }
        },
        toInt: true
    },
    mt: {
        isInt: {
            options: {
                min: 0,
                max: 100
            }
        },
        toInt: true
    },
    ms: {
        isInt: {
            options: {
                min: 0,
                max: 100
            }
        },
        toInt: true
    },
    ma: {
        isInt: {
            options: {
                min: 0,
                max: 100
            }
        },
        toInt: true
    }
})

const validate = (req, res, next) => {
    const errors = validationResult(req);

    return errors.isEmpty() ? next() : res.status(400).send(errors.array()[0].msg)
}

module.exports = {testsValid, validate}