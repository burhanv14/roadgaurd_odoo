import { useEffect, useState, useCallback } from "react";
import { clsx, type ClassValue } from "clsx";
import { NAV_LINKS } from "../constants";
import type { ScrollState, HeaderProps } from "../types/header";

// Enhanced utility to merge class names with proper TypeScript support
const cn = (...classes: ClassValue[]): string => clsx(classes);

export function RAHeader({ className, fixed = true }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolled: false,
    isVisible: true,
    isRounded: false,
    lastScrollY: 0,
    scrollDirection: 'none',
  });

  // Enhanced scroll detection with improved performance and animations
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    setScrollState((prev) => {
      const newState: ScrollState = { ...prev };
      const scrollDiff = currentScrollY - prev.lastScrollY;
      
      // Determine scroll direction
      if (Math.abs(scrollDiff) > 5) {
        newState.scrollDirection = scrollDiff > 0 ? 'down' : 'up';
      }
      
      // Determine states based on scroll position
      const atTop = currentScrollY <= 10;
      const inRoundedZone = currentScrollY > 10 && currentScrollY <= 200;
      const inHideZone = currentScrollY > 300;
      
      // Update rounded state
      newState.isRounded = inRoundedZone || (currentScrollY > 200 && newState.isVisible);
      newState.isScrolled = !atTop;
      
      // Enhanced visibility logic
      if (inHideZone) {
        if (newState.scrollDirection === 'down' && scrollDiff > 10) {
          newState.isVisible = false;
        } else if (newState.scrollDirection === 'up' && scrollDiff < -10) {
          newState.isVisible = true;
        }
      } else {
        newState.isVisible = true;
      }
      
      newState.lastScrollY = currentScrollY;
      return newState;
    });
  }, []);

  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Enhanced body scroll lock with cleanup
  useEffect(() => {
    const body = document.body;
    const originalStyle = window.getComputedStyle(body).overflow;
    
    if (open) {
      body.style.overflow = "hidden";
      // Prevent scroll on touch devices
      body.style.position = "fixed";
      body.style.width = "100%";
      body.style.top = `-${window.scrollY}px`;
    } else {
      body.style.overflow = originalStyle;
      body.style.position = "";
      body.style.width = "";
      body.style.top = "";
    }
    
    return () => {
      body.style.overflow = originalStyle;
      body.style.position = "";
      body.style.width = "";
      body.style.top = "";
    };
  }, [open]);

  // Close mobile menu on route change (for SPA routing)
  useEffect(() => {
    const handleRouteChange = () => setOpen(false);
    
    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    
    // For frameworks like Next.js or React Router
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
        setOpen(false);
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  const headerClasses = cn(
    // Base classes
    "z-50 transition-all duration-500 ease-out will-change-transform",
    // Position classes
    fixed && "fixed",
    // Visibility and transform
    scrollState.isVisible 
      ? "translate-y-0 opacity-100" 
      : "-translate-y-full opacity-0",
    // Width and positioning based on scroll state
    scrollState.isRounded 
      ? "inset-x-2 top-2 sm:inset-x-4 sm:top-4 rounded-2xl shadow-2xl shadow-black/20" 
      : "inset-x-0 top-0 rounded-none shadow-none",
    // Background based on scroll state with enhanced blur
    scrollState.isScrolled
      ? "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl border border-border/40"
      : "bg-transparent border-transparent",
    // Custom classes
    className
  );

  const containerClasses = cn(
    "mx-auto flex items-center justify-between transition-all duration-500 ease-out",
    // Responsive padding
    "px-3 sm:px-4 lg:px-6",
    // Height and max-width based on state
    scrollState.isRounded 
      ? "h-12 sm:h-14 max-w-4xl lg:max-w-5xl" 
      : "h-14 sm:h-16 md:h-18 lg:h-20 max-w-5xl lg:max-w-7xl"
  );

  return (
    <header className={headerClasses} role="banner">
      <div className={containerClasses}>
        {/* Enhanced Logo */}
        <a 
          href="/" 
          className="flex items-center gap-2 sm:gap-3 group" 
          aria-label="ReadyAssist Home"
        >
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110",
              // THEME CHANGE: Replaced yellow with blue
              "bg-blue-600 dark:bg-blue-500",
              scrollState.isRounded 
                ? "h-6 w-6 sm:h-7 sm:w-7" 
                : "h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9",
              scrollState.isScrolled && "shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
            )}
            aria-hidden="true"
          >
            <span className={cn(
              "rounded-sm bg-black dark:bg-white transition-all duration-300",
              scrollState.isRounded 
                ? "h-2.5 w-2.5 sm:h-3 sm:w-3" 
                : "h-3 w-3 sm:h-4 sm:w-4"
            )} />
          </span>
          <span className={cn(
            "font-bold tracking-tight text-foreground transition-all duration-300 select-none",
            scrollState.isRounded 
              ? "text-sm sm:text-base" 
              : "text-base sm:text-lg lg:text-xl"
          )}>
            ReadyAssist
          </span>
        </a>

        {/* Enhanced Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "relative font-medium transition-all duration-300 hover:text-foreground",
                // THEME CHANGE: Replaced yellow with blue
                "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-500 dark:after:bg-blue-400",
                "after:transition-all after:duration-300 hover:after:w-full",
                scrollState.isRounded 
                  ? "text-xs lg:text-sm text-muted-foreground/90" 
                  : "text-sm lg:text-base text-muted-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Enhanced Action Buttons */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <a 
            href="tel:+1234567890" 
            className={cn(
              // THEME CHANGE: Replaced yellow hover with blue
              "font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-300",
              "hover:scale-105 active:scale-95",
              scrollState.isRounded 
                ? "text-xs lg:text-sm" 
                : "text-sm lg:text-base"
            )} 
            aria-label="Call 24x7 Support"
          >
            24×7 Support
          </a>
          <button
            className={cn(
              "font-semibold rounded-xl border-0 transition-all duration-300",
              "hover:scale-105 active:scale-95 hover:shadow-lg",
              // THEME CHANGE: Replaced yellow with blue and refactored from inline style
              "bg-blue-600 dark:bg-blue-500 text-white",
              "shadow-lg shadow-blue-600/30 dark:shadow-blue-500/30",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              scrollState.isRounded 
                ? "px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm" 
                : "px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base"
            )}
          >
            Get Help
          </button>
        </div>

        {/* Enhanced Mobile Menu Button */}
        <button
          className={cn(
            "inline-flex items-center justify-center rounded-lg border border-border/50 md:hidden",
            "transition-all duration-300 hover:bg-muted/50 active:scale-95",
            // THEME CHANGE: Replaced yellow with blue
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            scrollState.isRounded 
              ? "h-8 w-8 sm:h-9 sm:w-9" 
              : "h-9 w-9 sm:h-10 sm:w-10"
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(prev => !prev)}
        >
          <div className={cn(
            "relative transition-all duration-300",
            scrollState.isRounded ? "h-3 w-3" : "h-4 w-4"
          )}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "absolute left-0 block bg-foreground transition-all duration-300",
                  scrollState.isRounded ? "h-0.5 w-3" : "h-0.5 w-4",
                  i === 0 && (scrollState.isRounded ? "top-0" : "top-0"),
                  i === 1 && (scrollState.isRounded ? "top-[4px]" : "top-[6px]"),
                  i === 2 && (scrollState.isRounded ? "top-2" : "top-3"),
                  open && i === 0 && (scrollState.isRounded ? "translate-y-[4px] rotate-45" : "translate-y-[6px] rotate-45"),
                  open && i === 1 && "opacity-0 scale-0",
                  open && i === 2 && (scrollState.isRounded ? "-translate-y-[4px] -rotate-45" : "-translate-y-[6px] -rotate-45")
                )}
              />
            ))}
          </div>
        </button>
      </div>

      {/* Enhanced Mobile Navigation Drawer */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-500 ease-out",
          scrollState.isScrolled && !scrollState.isRounded && "border-t border-border/30",
          scrollState.isRounded && "border-t border-border/20 mx-2 sm:mx-4",
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav 
          className={cn(
            "flex flex-col gap-1 py-4 transition-all duration-300",
            scrollState.isRounded 
              ? "px-4 sm:px-6 max-w-4xl mx-auto" 
              : "px-3 sm:px-4 max-w-5xl mx-auto"
          )} 
          aria-label="Mobile Navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-xl px-4 py-3 text-base font-medium text-foreground",
                "transition-all duration-200 hover:bg-muted/70 active:bg-muted",
                "border border-transparent hover:border-border/30"
              )}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          
          {/* Mobile Action Buttons */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="tel:+1234567890"
              className={cn(
                "flex items-center justify-center rounded-xl px-4 py-3",
                "text-base font-medium text-foreground",
                "border border-border/50 transition-all duration-200",
                "hover:bg-muted/50 active:bg-muted"
              )}
              onClick={() => setOpen(false)}
            >
              📞 24×7 Support
            </a>
            <button
              className={cn(
                "rounded-xl px-4 py-3 text-base font-semibold",
                // THEME CHANGE: Replaced yellow with blue and refactored from inline style
                "bg-blue-600 dark:bg-blue-500 text-white",
                "transition-all duration-200 hover:opacity-90 active:scale-98"
              )}
              onClick={() => setOpen(false)}
            >
              Get Help Now
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden -z-10"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

// Hook for header visibility control across different pages
export const useHeaderVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  const hideHeader = useCallback(() => setIsVisible(false), []);
  const showHeader = useCallback(() => setIsVisible(true), []);
  
  return { isVisible, hideHeader, showHeader };
};