export function Card({ children, className }) {
        return <div className={`p-4 border rounded shadow ${className}`}>{children}</div>;
      }
      