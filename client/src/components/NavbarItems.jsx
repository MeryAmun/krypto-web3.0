export const items = ["Market", "Exchange", "Tutorials", "Wallets"];

export const NavbarItem = ({ title, classProps }) => {
  return <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>;
};
