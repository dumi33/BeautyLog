'use client';

import styles from './Layout.module.css';
import { useState } from "react";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import HomeView from "./views/HomeView";
import RecordListView from "./views/RecordListView";
import RecordWriteView from "./views/RecordWriteView";
import ProcedureDetailView from "./views/ProcedureDetailView";
import AppointmentManageView from "./views/AppointmentManageView";
import MyTabView from "./views/MyTabView";
import RecordDetailView from "./views/RecordDetailView";
import { DERMA_RECORDS } from "./constants";

export default function Home() {
    const [tab, setTab] = useState("home");
    const [view, setView] = useState("home");
    const [selectedRecord, setSelectedRecord] = useState(null);

    return (
        <div className={styles.appLayout}>
            <TopBar />
            <div className={styles.appContent}>
                {view === "record-write" ? (
                    <RecordWriteView
                        onBack={() => setView("home")}
                        onSave={async (payload) => {
                            setTab("record");
                        }}
                    />
                ) : view === "record-detail" ? (
                    <RecordDetailView
                        record={selectedRecord}
                        onBack={() => setView("home")}
                        onSave={(updated) => setSelectedRecord(updated)}
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
                        onBack={() => setTab("home")}
                        onRecordClick={(record) => {
                            setSelectedRecord(record);
                            setView("record-detail");
                        }}
                    />
                ) : (
                    <MyTabView onTabChange={setTab} />
                )}
            </div>
            <BottomNav
                activeTab={tab}
                onTabChange={(t) => {
                    setTab(t);
                    setView("home"); // 탭 이동 시 상세 뷰(작성 등)에서 메인 탭으로 빠져나오게 설정
                }}
            />
        </div>
    );
}
