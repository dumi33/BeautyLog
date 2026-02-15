'use client'

import { useState } from "react";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import HomeView from "./views/HomeView";
import RecordListView from "./views/RecordListView";
import RecordWriteView from "./views/RecordWriteView";
import ProcedureDetailView from "./views/ProcedureDetailView";
import AppointmentManageView from "./views/AppointmentManageView";
import NewsTabView from "./views/NewsTabView";
import MyTabView from "./views/MyTabView";
import { DERMA_RECORDS } from "./constants";

export default function Home() {
    const [tab, setTab] = useState("home");
    const [view, setView] = useState("home");

    return (
        <div className="app-layout">
            <TopBar />
            <div className="app-content">
                {view === "record-write" ? (
                    <RecordWriteView
                        onBack={() => setView("home")}
                        onSave={async (payload) => {
                            console.log("저장:", payload);
                        }}
                    />
                ) : view === "procedure-detail" ? (
                    <ProcedureDetailView onBack={() => setView("home")} />
                ) : view === "appointment-manage" ? (
                    <AppointmentManageView onBack={() => setView("home")} />
                ) : tab === "home" ? (
                    <HomeView
                        onMenuClick={(id) => {
                            if (id === "record-write") setView("record-write");
                            else if (id === "procedure-detail") setView("procedure-detail");
                            else if (id === "appointment-manage") setView("appointment-manage");
                            else setView("home");
                        }}
                    />
                ) : tab === "record" ? (
                    <RecordListView
                        title="피부과 기록"
                        records={DERMA_RECORDS}
                        onBack={() => setTab("home")}
                    />
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
