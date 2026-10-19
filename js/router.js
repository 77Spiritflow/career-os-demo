/* ============================================================
   router.js | Career OS — 页面跳转辅助函数
   所有页面跳转优先使用此模块，统一管理路由
   ============================================================ */

var Router = (function () {
    // 基础路径（同目录下的页面）
    var BASE = '';

    return {
        /**
         * 跳转到指定页面
         * @param {string} page - 页面文件名，如 'index.html'
         */
        go: function (page) {
            window.location.href = BASE + page;
        },

        /** 跳转到首页 */
        toIndex: function () {
            this.go('index.html');
        },

        /** 跳转到职业测评页 */
        toAssessment: function () {
            this.go('assessment.html');
        },

        /** 跳转到AI深度分析页 */
        toAiAnalysis: function () {
            this.go('ai-analysis.html');
        },

        /** 跳转到AI对话页 */
        toAiChat: function () {
            this.go('ai-chat.html');
        },

        /** 跳转到设置页 */
        toSettings: function () {
            this.go('settings.html');
        },

        /** 跳转到职业图景页 */
        toCareerVision: function () {
            this.go('career-vision.html');
        },

        /** 跳转到登录页 */
        toLogin: function () {
            this.go('login.html');
        },

        /** 浏览器后退 */
        back: function () {
            window.history.back();
        },

        /**
         * 获取当前页面名称
         * @returns {string} 如 'index', 'assessment', 'ai-analysis' 等
         */
        currentPage: function () {
            var path = window.location.pathname;
            var file = path.substring(path.lastIndexOf('/') + 1);
            return file.replace('.html', '');
        }
    };
})();
