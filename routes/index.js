const aboutUs = require('./aboutUs');
const companyProfile = require('./companyProfile');
const profileView = require('./profileView');
const landing = require('./landing');
const loginRoutes = require('./login');
const signupRoutes = require('./signup');
const userProfile = require('./userProfile');
const notFoundError = require('./404page.js');
const successCreation = require('./successCreation.js');
const searchApi = require('./searchApi');
const logout = require('./logout') 

const constructorMethod = (app) => {
    app.use('/', landing);
    app.use('/search', searchApi);
    app.use('/logout', logout);
    //app.use('/about', aboutUs);
    // app.use('/company/', companyView);
    app.use('/company/create', companyProfile);
    app.use('/profile/', profileView);
    app.use('/successCreation', successCreation);
    app.use('/company', companyProfile);
    app.use('/user', userProfile);
    app.use('/login', loginRoutes);
    app.use('/signup', signupRoutes);
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

module.exports = constructorMethod;