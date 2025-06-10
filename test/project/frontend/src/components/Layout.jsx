const Layout = ({ left, center, right }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr',
      gap: '20px',
      padding: '30px',
      backgroundColor: '#f0f2ff',
      minHeight: '100vh',
      fontFamily: '"Apple SD Gothic Neo", sans-serif'
    }}>
      <div>{left}</div>
      <div>{center}</div>
      <div>{right}</div>
    </div>
  );
};

export default Layout;
