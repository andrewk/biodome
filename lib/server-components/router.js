export default function router(dataStream, commandStream) {
  return (req, res) => {
    // TODO 404
    if (req.something) {
      res.something();
    }
  };
}
