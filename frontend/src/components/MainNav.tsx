import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@components/ui/navigation-menu.tsx";
import { Link } from "react-router-dom";
import React from "react";
import { Users } from "lucide-react";
import { cn } from "@lib/utils.ts";

interface Item {
  to: string;
  title: string;
  Icon?: React.JSX.Element;
  children?: Item[];
}

function MainNav() {
  const items: Item[] = [
    { to: "/customers?$sort[id]=-1", title: "Customers" },
    {
      to: "",
      title: "Administration",
      children: [
        {
          to: "/admin/users",
          title: "Users",
          Icon: <Users className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item: Item) => {
          return (
            <NavigationMenuItem key={item.to} className={cn("relative")}>
              {item.children ? (
                <>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent
                    className={cn("rounded shadow top-[40px]")}
                  >
                    <ul>
                      {item.children.map((child: Item) => (
                        <NavigationMenuLink
                          className={cn(
                            "flex items-center space-x-2 py-4 px-6"
                          )}
                          key={child.to}
                          asChild
                        >
                          <Link to={child.to}>
                            <>
                              <span>{child.Icon || null}</span>
                              <span>{child.title}</span>
                            </>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link to={item.to}>{item.title}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default MainNav;
