export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">样式测试页面</h1>

      {/* 测试基础Tailwind类 */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">基础样式测试</h2>
        <p className="text-gray-600">如果你看到白色背景和黑色文字，说明Tailwind基础样式生效了</p>
      </div>

      {/* 测试自定义SASS样式 */}
      <div className="apple-button-primary mb-6">
        自定义SASS按钮样式
      </div>

      {/* 测试动画 */}
      <div className="animate-float bg-blue-500 text-white p-4 rounded inline-block">
        飘动动画测试
      </div>

      {/* 测试渐变 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded mt-4">
        渐变背景测试
      </div>

      {/* 测试Tailwind预设颜色 */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-red-500 p-4 text-white">红色</div>
        <div className="bg-green-500 p-4 text-white">绿色</div>
        <div className="bg-blue-500 p-4 text-white">蓝色</div>
      </div>
    </div>
  );
}