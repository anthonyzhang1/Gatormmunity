/* This file holds the component that scrolls the page to the top automatically after changing pages.
 * The component is called in index.js. */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    /* Scrolls to the top of the page after the URL changes. */
    useEffect(() => window.scrollTo(0, 0), [pathname]);
}