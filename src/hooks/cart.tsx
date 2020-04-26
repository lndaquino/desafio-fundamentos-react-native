import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { Product } from '../pages/Cart/styles';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const cart = await AsyncStorage.getItem('GoMarketplace:cart');
      // await AsyncStorage.clear();

      console.log({ cart });

      if (cart) {
        setProducts(JSON.parse(cart));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Omit<Product, 'quantity'>) => {
      const existsInCart = products.find(item => item.id === product.id);

      if (existsInCart) {
        const updatedProduct = {
          id: existsInCart.id,
          title: existsInCart.title,
          image_url: existsInCart.image_url,
          price: existsInCart.price,
          quantity: existsInCart.quantity + 1,
        };
        // falta conseguir atualizar sem dar pau a qtd
        return;
      }

      // cria o produto no carrinho com qtd=1
      const newProductinCart = {
        id: product.id,
        title: product.title,
        image_url: product.image_url,
        price: product.price,
        quantity: 1,
      };

      setProducts(prevState => {
        return [...prevState, newProductinCart];
      });

      await AsyncStorage.setItem(
        'GoMarketplace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const product = products.find(item => item.id === id);

      if (product) {
        product.quantity += 1;
      }

      const updatedProducts = products.map(item => {
        if (item.id === id) {
          return product;
        }
        return item;
      });

      setProducts(updatedProducts);

      await AsyncStorage.setItem(
        'GoMarketplace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const product = products.find(item => item.id === id);

      if (product) {
        product.quantity = product.quantity === 0 ? 0 : product?.quantity - 1;
      }

      const updatedProducts = products.map(item => {
        if (item.id === id) {
          return product;
        }
        return item;
      });

      setProducts(updatedProducts);

      await AsyncStorage.setItem(
        'GoMarketplace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
