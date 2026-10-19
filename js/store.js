/* ============================================================
   store.js | Career OS — 全局数据存储
   所有跨页面共享数据统一存放于此，使用 localStorage 持久化
   ============================================================ */

var Store = (function () {
    var STORAGE_KEY = 'career_os_store';

    // 默认数据结构
    var _defaults = {
        user: null,           // 用户账号信息 { id, name, email, ... }
        assessment: null,     // 测评结果 { answers, scores, code, codeNames, profile, recommendedCareers }
        careerGoal: null,     // 用户选定的职业目标数组 [{ name, dim, ... }]
        goalPool: null,       // AI 拆解的中长期目标清单 [{ id, stage, name, reason, done }]
        timeline: null,       // 中长期目标
        dailyTasks: null,     // 拆解后的每日任务数组
        portfolio: null       // 用户上传的成果沉淀列表
    };

    // 当前内存数据
    var _data = {};

    // 从 localStorage 读取
    function _load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                _data = JSON.parse(raw);
            } else {
                _data = _deepClone(_defaults);
            }
        } catch (e) {
            _data = _deepClone(_defaults);
        }
        // 确保每个字段都有默认值
        for (var key in _defaults) {
            if (_data[key] === undefined) {
                _data[key] = _defaults[key];
            }
        }
    }

    // 保存到 localStorage
    function _save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
        } catch (e) {
            console.warn('[Store] localStorage 写入失败', e);
        }
    }

    // 深拷贝
    function _deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // 初始化
    _load();

    return {
        /**
         * 获取指定字段值
         * @param {string} key - 字段名
         * @returns {*} 字段值
         */
        get: function (key) {
            if (key) return _data[key];
            return _deepClone(_data);
        },

        /**
         * 设置指定字段值并持久化
         * @param {string} key - 字段名
         * @param {*} value - 字段值
         */
        set: function (key, value) {
            _data[key] = value;
            _save();
        },

        /**
         * 批量更新多个字段
         * @param {Object} updates - { key1: value1, key2: value2, ... }
         */
        batch: function (updates) {
            for (var key in updates) {
                if (updates.hasOwnProperty(key)) {
                    _data[key] = updates[key];
                }
            }
            _save();
        },

        /**
         * 清空所有数据，恢复默认值
         */
        clear: function () {
            _data = _deepClone(_defaults);
            _save();
        },

        /**
         * 删除指定字段
         * @param {string} key
         */
        remove: function (key) {
            _data[key] = _defaults[key] !== undefined ? _defaults[key] : null;
            _save();
        },

        /**
         * 检查用户是否已完成测评
         * @returns {boolean}
         */
        hasAssessment: function () {
            return !!(_data.assessment && _data.assessment.code);
        },

        /**
         * 检查用户是否已选定职业目标
         * @returns {boolean}
         */
        hasCareerGoal: function () {
            return !!(_data.careerGoal && _data.careerGoal.length > 0);
        }
    };
})();
