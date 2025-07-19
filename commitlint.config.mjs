/**
 * 提交信息格式：<type>[optional scope]: <description>
 *
 * 支持的类型：
 * - feat: 新功能
 * - fix: 修复
 * - docs: 文档
 * - style: 代码格式（不影响代码运行的变动）
 * - refactor: 重构
 * - perf: 性能优化
 * - test: 增加测试
 * - chore: 构建过程或辅助工具的变动
 * - ci: CI配置文件和脚本的变动
 * - build: 影响构建系统或外部依赖的变动
 * - revert: 回滚之前的commit
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'build', 'revert']
    ]
  }
}
