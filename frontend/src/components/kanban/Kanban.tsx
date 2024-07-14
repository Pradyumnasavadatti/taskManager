function Kanban() {
  function dropHandler(e: any) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    console.log(e);
    return true;
  }
  return (
    <div className="flex flex-col justify-start items-start p-2 col-span-4">
      <h1 className="text-4xl text-app-theme-400">Kanban Board</h1>
      <div className="w-full h-[95%]">
        <div className="w-full h-full grid gap-2 grid-cols-3">
          <div
            className="w-full min-h-full bg-red-900 overflow-scroll"
            onDrop={dropHandler}
          >
            <div
              className="w-[80%] h-[10vh] bg-yellow-300 cursor-pointer"
              draggable={true}
            >
              Jeevana
            </div>
          </div>
          <div
            className="w-full bg-yellow-900 min-h-full overflow-scroll"
            onDrop={dropHandler}
          ></div>
          <div
            className="w-full bg-purple-900 min-h-full overflow-scroll"
            onDrop={dropHandler}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Kanban;
