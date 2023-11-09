import __dirname from "../utils.js";
import productsModel from "../dao/models/products.models.js";


const productController = {
    list: async (req, res) => {
    try {
     
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || '';
      const query = req.query.query || '';
      const category = req.query.categoria || '';
      const stock = req.query.stock || '';

      const options = {
        page,
        limit,
        sort,
        lean: true,
      };
      const filters = {};
      if (query) {
        filters.$or = [
          { title: { $regex: query, $options: 'i' } },        
        ];
      }

      if (category) {
        filters.category = category;
      }

      if (stock) {
        filters.stock = stock === 'stock' ? { $gt: 0 } : 0;
      }
     

      const result = await productsModel.paginate(filters, options);

      const pagination = {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.hasPrevPage ? page - 1 : null,
        nextPage: result.hasNextPage ? page + 1 : null,
        page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null,
        nextLink: result.hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null,

      };

      res.render("realtimeproducts", {
        products: result.docs,
        pagination,
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  },
  detailProduct: async (req, res) => {
    try {
      const id = req.params.pid;
      const product = await productsModel.findOne({ _id: id }).lean().exec();
      res.render("detalleProduct", { product });
    } catch (error) {
      res.send({ error: "No se encuentra el producto" });
    }
  },
  create: (req, res) => {
    res.render("newProduct", {
      titulo: "Crear producto nuevo",
    });
  },
  store: async (req, res) => {
    try {
      const { title, description, price, stock, code, thumbnail } = req.body;
      const ext = req.file.originalname.split(".").pop();
      const newProduct = await productsModel.create({
        title: title,
        description: description,
        price: price,
        stock: stock,
        code: code,
        thumbnail: thumbnail + "." + ext,
      });

      console.log("Producto guardado:", newProduct);
      res.redirect("/api/products/detail/" + newProduct._id);
    } catch (error) {
      res.status(500).send("No se puede agregar el producto: " + error);
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.pid;
      const findProduct = await productsModel
        .findOne({ _id: id })
        .lean()
        .exec();
      res.render("editProduct", {
        titulo: "Editar Producto",
        product: findProduct,
      });
    } catch (error) {
      res.status(500).send("No se encuentra el producto: " + error);
    }
  },
  edited: async (req, res) => {
    try {
      const id = req.params.pid;
      const pid = await productsModel.findOne({ _id: id });
      const {title, price, stock, description, code } = req.body;
      let thumbnail;
      if (req.file) {
        thumbnail = req.file.filename;
      }
      const dataUpdate = {title, price, stock, description, code, };
      if (thumbnail) {
        dataUpdate.thumbnail = thumbnail;
      }
      console.log(dataUpdate.thumbnail);
      await productsModel.updateOne(pid, dataUpdate);
      res.redirect("/api/products/detail/" + id);
    } catch (error) {
      res.status(500).send("Error al editar el producto: " + error);
    }
  },
  delete: async (req, res) => {
    const productId = req.params.pid;
    try {
      const product = await productsModel
        .findOne({ _id: productId })
        .lean()
        .exec();

      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      } else {
        await productsModel.deleteOne({ _id: productId });
        res.redirect("/api/products");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  },
};

export default productController;
