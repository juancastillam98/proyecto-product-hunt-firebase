import Link from 'next/link'
import {css} from "@emotion/css"
export default function NotFound() {
    return (
        <div>
            <h2
                className={css`
                  display: flex;
                  align-items: center;
                `}
            >Not Found</h2>
            <p>Producto no existente</p>
            <Link href="/">Volver al inicio</Link>
        </div>
    )
}