let sessions = {};

const logout = (req, res) => {
    const { user: login } = req.session;

    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }

        if (sessions[login]) {
            delete sessions[login];
        }

        res.clearCookie(process.env.SESS_NAME);
        res.redirect('/');
    });
};

module.exports = {
    logout,
};
