'use client'

import { useState } from "react";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import HomeView from "./views/HomeView";
import RecordListView from "./views/RecordListView";
import RecordTabView from "./views/RecordTabView";
import NewsTabView from "./views/NewsTabView";
import MyTabView from "./views/MyTabView";
import { LIST_VIEWS } from "./constants";

export default function Home() {
    const [tab, setTab] = useState("home");
    const [view, setView] = useState("home");

    const isListScreen = LIST_VIEWS[view];

    return (
        <div className="app-layout">
            <TopBar />
            <div className="app-content">
                {isListScreen ? (
                    <RecordListView
                        title={LIST_VIEWS[view].title}
                        records={LIST_VIEWS[view].records}
                        onBack={() => setView("home")}
                    />
                ) : tab === "home" ? (
                    <HomeView onMenuClick={(id) => setView(`${id}-list`)} />
                ) : tab === "record" ? (
                    <RecordTabView />
                ) : tab === "news" ? (
                    <NewsTabView />
                ) : (
                    <MyTabView />
                )}
            </div>
            <BottomNav activeTab={tab} onTabChange={setTab} />
        </div>
    );
}
