export default function ProductThumb({ product, className = "motif", style = {} }) {
  if (product.image_url) {
    return (
      <div
        className={className}
        style={{
          ...style,
          backgroundImage: `url(${product.image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }
  return <div className={className} style={{ "--m1": product.color, ...style }} />;
}
