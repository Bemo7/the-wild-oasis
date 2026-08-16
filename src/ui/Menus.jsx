import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props?.position?.x}px;
  top: ${(props) => props?.position?.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenuContext = createContext();

function Menus({ children }) {
  const [openId, setOpenId] = useState(null);
  const [position, setPosition] = useState(null);
  const close = () => setOpenId(null);
  const open = (id) => setOpenId(id);

  return (
    <MenuContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenuContext.Provider>
  );
}

function Toggle({ id }) {
  const { open, close, openId, setPosition } = useContext(MenuContext);
  const btnRef = useRef(null);
  const clickCount = useRef(0);

  const handleClick = useCallback(
    (e) => {
      const buttonRect = e.target.closest("button")?.getBoundingClientRect();

      setPosition({
        x: window.innerWidth - buttonRect.right,
        y: buttonRect.bottom,
      });

      if (clickCount.current > 1 && openId === id) {
        close();
        clickCount.current = 0;
        return;
      }

      if (!openId || openId !== id) {
        open(id);
      }

      clickCount.current += 1;
    },
    [openId, id],
  );

  useEffect(() => {
    const button = btnRef.current;
    button?.addEventListener("click", handleClick, true);

    return () => {
      button?.removeEventListener("click", handleClick, true);
    };
  }, [handleClick]);

  return (
    <StyledToggle onClick={handleClick} ref={btnRef}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openId, close, position } = useContext(MenuContext);
  const ref = useOutsideClick(close);

  if (openId !== id) return null;

  return createPortal(
    <StyledList position={position} onClose={close} ref={ref}>
      {children}
    </StyledList>,
    document.body,
  );
}

function Button({ children, icon, onClick }) {
  const { close } = useContext(MenuContext);
  const handleClick = (e) => {
    onClick?.(e);
    close();
  };

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Button = Button;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Menu = Menu;

export default Menus;
