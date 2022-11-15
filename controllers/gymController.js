export const fetch = (req, res, next) => {
  res.send("fetch");
};

export const upload = (req, res) => {
  res.send("upload");
};

export const uploadPost = async (req, res, next) => {
  res.send("uploadPost");
};

export const detail = (req, res, next) => {
  res.send("detail");
};

export const remove = async (req, res, next) => {
  res.send("remove");
};

export const update = (req, res, next) => {
  res.send("update");
};

export const updatePost = async (req, res, next) => {
  res.send("updatePost");
};
