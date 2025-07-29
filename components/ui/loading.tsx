const Loading = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex flex-col items-center justify-center space-y-6">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-white/70"></div>

            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Hash Coin</h1>
                <p className="text-white/80 mt-2">Mining your assets...</p>
            </div>

            <div className="w-64 bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-1/3 animate-pulse rounded-full"></div>
            </div>
        </div>
    )
}

export default Loading
