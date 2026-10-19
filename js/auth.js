/* ============================================================
   auth.js | Career OS — 认证模块
   阶段1：纯前端模拟，不接 Supabase
   阶段2：接入 Supabase 真实认证
   ============================================================ */

var Auth = (function () {
    return {
        /**
         * 检查用户是否已登录
         * @returns {boolean}
         */
        isLoggedIn: function () {
            return !!(Store && Store.get('user'));
        },

        /**
         * 获取当前登录用户信息
         * @returns {Object|null}
         */
        getUser: function () {
            return Store ? Store.get('user') : null;
        },

        /**
         * 模拟登录（阶段1）
         * @param {Object} userData - 用户数据 { id, name, email }
         */
        login: function (userData) {
            if (Store) {
                Store.set('user', userData);
            }
        },

        /**
         * 退出登录
         */
        logout: function () {
            if (Store) {
                Store.set('user', null);
            }
        },

        /**
         * 需要登录时调用，未登录则跳转登录页
         * @returns {boolean} 是否已登录
         */
        requireLogin: function () {
            if (!this.isLoggedIn()) {
                if (typeof Router !== 'undefined') {
                    Router.toLogin();
                }
                return false;
            }
            return true;
        }
    };
})();
