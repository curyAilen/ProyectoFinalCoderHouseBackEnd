const mainController = {
    main: (req, res) => {
        res.render('index', {
            titulo: 'inicio',
        });
    }
}

export default mainController;