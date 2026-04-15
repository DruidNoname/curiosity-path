import React, { PropsWithChildren } from "react";
import styles from "./style.module.css";
import ErrorBoundary from "@/components/ErrorBoundary";

interface MainNAsideLayoutProps {
    mainContent: React.ReactNode;
    asideContent?: React.ReactNode;
    asideClassName?: string;
}

const MainNAsideLayout: React.FC<MainNAsideLayoutProps> = ({ mainContent, asideContent, asideClassName }) => {
    return (
        <ErrorBoundary componentName="MainNAsideLayout">
            <div className={styles.mainContent}>
                <div>
                    {mainContent}
                </div>
                {asideContent && (
                    <aside className={asideClassName ? [styles.asideContent, asideClassName].join(' ') : styles.asideContent}>
                        {asideContent}
                    </aside>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default MainNAsideLayout;