// for flash
module.exports.setFlash = function(req,res,next) {
    // find flash from the req and set it up in the locals of res
    res.locals.flash = {
        'success' : req.flash('success'),
        'error'  : req.flash('error')

    }
    next();
}