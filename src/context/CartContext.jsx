import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

const CART_KEY = 'al-brr-cart'

function getStoredCart() {
  try {
    const storedCart = localStorage.getItem(CART_KEY)

    if (!storedCart) return []

    const parsedCart = JSON.parse(storedCart)

    if (!Array.isArray(parsedCart)) return []

    // Sirf valid cart items rakho
    return parsedCart.filter(
      (item) =>
        item &&
        item.id &&
        item.name &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    )
  } catch {
    localStorage.removeItem(CART_KEY)
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(getStoredCart)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      )

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity,
        },
      ]
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart((currentCart) =>
        currentCart.filter((item) => item.id !== productId)
      )
      return
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem(CART_KEY)
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}