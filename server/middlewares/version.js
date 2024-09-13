const semver = require('semver')

exports.versionMiddleware = (version) => {
    return function (req, res, next) {
        if(req.headers['x-version']){ // Si no existe el encabezado
            if (semver.eq(req.headers['x-version'], version)) {
                return next(); // Entreamos la version si es la correcta 
            }
            return next('route'); // Siguiente version
        }else{
            return next('route'); // Siguiente version
        }
    };
};