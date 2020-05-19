import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).send('Access denied. Please login!');

  const token = authorization.split(' ')[1];
  try {
    const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = userId;
    next();
  } catch (error) {
    res.status(400).send('Inavlid access token!');
  }
};

export default isAuth;
