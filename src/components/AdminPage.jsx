import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { supabase } from '../supabaseClient'
import { Trophy, Users, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

// クイズデータをインポート（App.jsxから）
const QUIZ_DATA = [
  {
    id: 1,
    type: 'multiple',
    question: '"AI木曜会"の由来は？',
    options: [
      '夏目漱石と若手文学者が集まり議論を重ねた「木曜会」から',
      '木曜日がオンライン参加率トップだったから',
      'usutakuさんが生まれた日が木曜だったから',
      '初回テスト勉強会がたまたま木曜だったから'
    ],
    answer: 0
  },
  {
    id: 2,
    type: 'multiple',
    question: 'AI木曜会の3大メインコンテンツは、usutakuさんの有料講座、ニュース振り返ろう会。最後は？',
    options: [
      'ハンズオン集中講座',
      'LT会',
      'ハッカソン',
      'オフ会'
    ],
    answer: 1
  },
  {
    id: 3,
    type: 'multiple',
    question: '木曜会のコンテンツで1番いいね数が多い動画は？',
    options: [
      '五味さんの社内AI推進',
      '飯塚さんのスクラップボックス知的生産',
      'usutakuさんのNotion講座(初級)',
      'usutakuさんのChatGPT基礎講座'
    ],
    answer: 2
  },
  {
    id: 4,
    type: 'multiple',
    question: 'AI木曜会のスローガンは、知をアップデートする、心身を整える。最後は？',
    options: [
      'AIで残業ゼロ',
      '共創で未来をつくる',
      '仕事はAIに任せよう',
      '場を創る'
    ],
    answer: 3
  },
  {
    id: 5,
    type: 'multiple',
    question: 'Fincs内で1番コメント数が多いのはだれ？',
    options: [
      '河瀬',
      'カイトさん',
      'さちをさん',
      '亀ちゃん'
    ],
    answer: 1
  },
  {
    id: 6,
    type: 'multiple',
    question: '【usutakuさんに関するクイズ】\n生年月日はいつ？',
    options: [
      '1995年5月5日',
      '1997年12月12日',
      '1999年4月29日',
      '2001年1月1日'
    ],
    answer: 2
  },
  {
    id: 7,
    type: 'multiple',
    question: '【usutakuさんに関するクイズ】\n卒業した大学はどこ？',
    options: [
      '京都大学',
      '東京大学',
      '国際基督教大学（ICU）',
      '慶應義塾大学'
    ],
    answer: 2
  },
  {
    id: 8,
    type: 'multiple',
    question: '【usutakuさんに関するクイズ】\n著書として正しいものはどれ？',
    options: [
      '『Notion AIハック 仕事と暮らしを劇的にラクにする72の最強アイデア』',
      '『生成AI実践マスター』',
      '『プロンプトエンジニアリング大全』',
      '『Midjourneyで描く未来』'
    ],
    answer: 0
  },
  {
    id: 9,
    type: 'multiple',
    question: 'Michikusa株式会社の設立日はいつ？',
    options: [
      '2023年10月26日',
      '2023年10月27日',
      '2023年10月28日',
      '2023年10月29日'
    ],
    answer: 3
  },
  {
    id: 10,
    type: 'multiple',
    question: 'Michikusa株式会社のミッションと社名の由来として、正しい組み合わせはどれ？',
    options: [
      'ミッション：AIの力で時間を作り、人生にミチクサを。\n社名の由来：夏目漱石の小説「道草」から。道草を前向きに捉え、煩雑な作業を最先端技術で解決して時間を創り出す。',
      'ミッション：AIで残業ゼロ、効率最大化。\n社名の由来：創業者が学生時代に道草ばかりしていた経験から。',
      'ミッション：AIの力で時間を作り、人生にミチクサを。\n社名の由来：創業メンバーが初めて出会った道端の草むらから。',
      'ミッション：生成AIで日本を変える。\n社名の由来：夏目漱石の小説「こころ」の登場人物「道草先生」から。'
    ],
    answer: 0
  },
  // 画像問題と文章問題は省略（必要に応じて追加）
]

export function AdminPage({ onLogout }) {
  const [teams, setTeams] = useState([])
  const [expandedTeam, setExpandedTeam] = useState(null)
  const [teamMembers, setTeamMembers] = useState({})
  const [showQuizList, setShowQuizList] = useState(false)

  useEffect(() => {
    fetchTeams()
    
    // リアルタイム更新を設定
    const teamsSubscription = supabase
      .channel('admin-teams-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
        fetchTeams()
      })
      .subscribe()

    const membersSubscription = supabase
      .channel('admin-members-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        fetchTeams()
        if (expandedTeam) {
          fetchTeamMembers(expandedTeam)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(teamsSubscription)
      supabase.removeChannel(membersSubscription)
    }
  }, [expandedTeam])

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')

    if (!error && data) {
      // 各チームのメンバー数と合計点数を取得
      const teamsWithStats = await Promise.all(
        data.map(async (team) => {
          const { data: members } = await supabase
            .from('members')
            .select('score')
            .eq('team_id', team.id)

          const memberCount = members?.length || 0
          const totalScore = members?.reduce((sum, m) => sum + (m.score || 0), 0) || 0

          return {
            ...team,
            memberCount,
            totalScore
          }
        })
      )

      setTeams(teamsWithStats)
    }
  }

  const fetchTeamMembers = async (teamId) => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('team_id', teamId)
      .order('score', { ascending: false })

    if (!error && data) {
      setTeamMembers(prev => ({ ...prev, [teamId]: data }))
    }
  }

  const handleTeamClick = async (teamId) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null)
    } else {
      setExpandedTeam(teamId)
      await fetchTeamMembers(teamId)
    }
  }

  const handleResetAll = async () => {
    if (!confirm('全チームをリセットしますか？この操作は取り消せません。')) {
      return
    }

    // 全メンバーのスコアと回答状況をリセット
    await supabase
      .from('members')
      .update({ score: 0, has_answered_current: false, master_trigger_result: false })
      .neq('id', '00000000-0000-0000-0000-000000000000') // 全レコード

    // 全チームの進行状況をリセット
    await supabase
      .from('teams')
      .update({ current_question: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000') // 全レコード

    alert('全チームをリセットしました')
    fetchTeams()
  }

  const handleResetTeam = async (teamId) => {
    if (!confirm('このチームをリセットしますか？')) {
      return
    }

    // チームメンバーのスコアと回答状況をリセット
    await supabase
      .from('members')
      .update({ score: 0, has_answered_current: false, master_trigger_result: false })
      .eq('team_id', teamId)

    // チームの進行状況をリセット
    await supabase
      .from('teams')
      .update({ current_question: 0 })
      .eq('id', teamId)

    alert('チームをリセットしました')
    fetchTeams()
    if (expandedTeam === teamId) {
      fetchTeamMembers(teamId)
    }
  }

  const getAnswerLabel = (index) => {
    return String.fromCharCode(65 + index) // 0→A, 1→B, 2→C, 3→D
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">管理者ページ</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowQuizList(!showQuizList)} variant="outline">
              {showQuizList ? 'クイズ一覧を閉じる' : 'クイズ一覧を表示'}
            </Button>
            <Button onClick={handleResetAll} variant="destructive">
              <RefreshCw className="mr-2 h-4 w-4" />
              全チームリセット
            </Button>
            <Button onClick={onLogout} variant="outline">
              ログアウト
            </Button>
          </div>
        </div>

        {/* クイズ一覧 */}
        {showQuizList && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>クイズ問題と正解一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {QUIZ_DATA.map((quiz, index) => (
                  <div key={quiz.id} className="border-b pb-4">
                    <h3 className="font-bold text-lg mb-2">Q{index + 1}: {quiz.question}</h3>
                    <div className="space-y-1 ml-4">
                      {quiz.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded ${
                            optIndex === quiz.answer
                              ? 'bg-green-100 border-2 border-green-500 font-bold'
                              : 'bg-gray-50'
                          }`}
                        >
                          {getAnswerLabel(optIndex)}. {option}
                          {optIndex === quiz.answer && ' ✓ 正解'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* チーム一覧 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              全チーム一覧（{teams.length}チーム）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teams.map((team) => (
                <div key={team.id} className="border rounded-lg overflow-hidden">
                  <div
                    className="p-4 bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => handleTeamClick(team.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg">{team.name}</h3>
                        <span className="text-sm text-gray-600">
                          <Users className="inline h-4 w-4 mr-1" />
                          {team.memberCount}人
                        </span>
                        <span className="text-sm text-gray-600">
                          問題: {team.current_question}/20
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                          <Trophy className="inline h-5 w-5 mr-1" />
                          {team.totalScore}点
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleResetTeam(team.id)
                        }}
                        variant="outline"
                        size="sm"
                      >
                        リセット
                      </Button>
                      {expandedTeam === team.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  {/* チームメンバー詳細 */}
                  {expandedTeam === team.id && teamMembers[team.id] && (
                    <div className="p-4 bg-gray-50 border-t">
                      <h4 className="font-bold mb-2">メンバー一覧</h4>
                      <div className="space-y-2">
                        {teamMembers[team.id].map((member) => (
                          <div
                            key={member.id}
                            className="flex justify-between items-center p-2 bg-white rounded"
                          >
                            <span className="font-medium">{member.name}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-600">
                                {member.has_answered_current ? '✓ 回答済み' : '未回答'}
                              </span>
                              <span className="font-bold text-indigo-600">
                                {member.score}点
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

