import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(Number(PORT), () => {
  // eslint-disable-next-line no-console
  console.log(`StreetFighter API running on port ${PORT}`);
});
