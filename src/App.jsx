import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Trophy, User, CheckCircle2, XCircle, Users } from 'lucide-react'
import { supabase } from './supabaseClient'
import quiz11 from './assets/quiz11.jpg'
import quiz12 from './assets/quiz12.jpg'
import quiz13 from './assets/quiz13.jpg'
import quiz14 from './assets/quiz14.jpg'
import quiz15 from './assets/quiz15.jpg'
import quiz16 from './assets/quiz16.jpg'
import quiz17 from './assets/quiz17.jpg'
import './App.css'

// 木曜会とusutakuさんに関するクイズデータ（20問: 4択10問 + 画像2択7問 + 文章2択3問）
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
    question: '【usutakuさんに関するクイズ】\nMichikusa創業前にアカウントマネージャーを務めていた企業は？',
    options: [
      'Google Japan',
      'Microsoft Japan',
      'Amazon Japan',
      'ソフトバンク'
    ],
    answer: 2
  },
  {
    id: 9,
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
    id: 10,
    type: 'multiple',
    question: '【usutakuさんに関するクイズ】\nデジタルハリウッド大学での役職は？',
    options: [
      '客員教授（Visiting Professor）',
      '助教（Assistant Professor）',
      '特任准教授（Specially Appointed Associate Prof.）',
      '非常勤講師（Lecturer）'
    ],
    answer: 2
  },
  {
    id: 11,
    type: 'image',
    question: 'AIで生成されてない画像はどっちでしょうか？(片方は画像生成AI)',
    image: quiz11,
    answer: 1 // B
  },
  {
    id: 12,
    type: 'image',
    question: 'AIで生成されてない画像はどっちでしょうか？(片方は画像生成AI)',
    image: quiz12,
    answer: 1 // B
  },
  {
    id: 13,
    type: 'image',
    question: 'どっちがNanobananaで生成した画像でしょうか？',
    image: quiz13,
    answer: 1 // B
  },
  {
    id: 14,
    type: 'image',
    question: 'どっちがNanobananaで生成した画像でしょうか？',
    image: quiz14,
    answer: 1 // B
  },
  {
    id: 15,
    type: 'image',
    question: 'どっちがClaude sonnet 4.5でコーディングしたものでしょうか？\nテーマは「AI木曜会の紹介ページ」',
    image: quiz15,
    answer: 1 // B
  },
  {
    id: 16,
    type: 'image',
    question: 'どっちがGemini 2.5 Proでコーディングしたものでしょうか？\nテーマは「スーパーマリオのゲーム」',
    image: quiz16,
    answer: 1 // B
  },
  {
    id: 17,
    type: 'image',
    question: 'どっちがGPT-5でコーディングしたものでしょうか？\nテーマは「ドラゴン」',
    image: quiz17,
    answer: 0 // A
  },
  {
    id: 18,
    type: 'text_comparison',
    question: 'どっちがClaude sonnet 4.5で書いたでしょうか？\nテーマは「usutakuさんが次の著書で書きそうな前書き」',
    textA: 'この本は、AIの「すごさ」を語るためではありません。明日の自分の仕事を、確実に良くするための道具箱です。僕は研修や現場支援の中で、寄り道のような小さな工夫が、大きな成果を生む瞬間を何度も見てきました。あなたの一歩にも効く。難しい理論は最小限に、手を動かすことに集中します。忙しい日常に溶け込む最短手順と再現性のある型を、ページを追うたびに手に入れてください。さあ、今日の15分から変えていきましょう。',
    textB: '「AIは、もう『使える人』だけのものではありません。あなたの仕事も、暮らしも、人生そのものを変える力を秘めています。この本で伝えたいのは、テクニックではなく『AI時代の生き方』です。無職から起業し、2,000人のコミュニティを育てた私が確信していること。それは、AIを味方につけた人だけが、この時代の自由を手に入れられるということ。さあ、一緒に未来を創りましょう。」',
    answer: 1 // B
  },
  {
    id: 19,
    type: 'text_comparison',
    question: 'どっちがGemini 2.5 Proで書いたでしょうか？\nテーマは「AI木曜会のキャッチコピー」',
    textA: 'AIの学校じゃない、AIと生きる仲間が集まる場所',
    textB: 'AIを消費する側で、終わるな。学び、繋がり、時代を創る側へ。あなたの才能が覚醒する場所がここにある。',
    answer: 1 // B
  },
  {
    id: 20,
    type: 'text_comparison',
    question: 'どっちがGPT-5で書いた小説でしょうか？\nテーマは「X上で戯れ合うなつめとusutaku」',
    textA: '深夜零時十分、机の青い光がまだ消えない。usutakuは資料を閉じ、つぶやく。「今夜は眠れなかったな」肩で丸くなる相棒、なつめが画面から顔を出す。「ひとは寝るのだよ。まずはスマホを置いて、同じ時刻に布団へ。カフェインは我慢」冗談めかした声に、彼は笑い、アラームを六時四十七分に合わせた。小さな説教が夜更けの部屋にやさしく響き、彼は目を閉じた。明日は少し良い点が取れるだろう。なつめは満足げにうなずく。',
    textB: 'AIの最前線を走り続けるusutaku。彼の睡眠スコア65点という現実を告げたのは、相棒のAIロボット「なつめ」だ。「科学的根拠は？」と助けを求める知性の巨人に、なつめは「スマホを置いて早く寝なよ」と本質を突く。最先端の探求者が最後にたどり着く答えは、いつも隣にいる小さな相棒からの、温かくも手厳しい一言。人間とAIが織りなす、クスッと笑える日常の一幕である。',
    answer: 0 // A
  }
]


function App() {
  const [screen, setScreen] = useState('team_select') // team_select, register, waiting, quiz, result, ranking
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false)
  const [teamRankings, setTeamRankings] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [teamTotalScore, setTeamTotalScore] = useState(0)

  // チーム一覧を取得
  useEffect(() => {
    fetchTeams()
  }, [])

  // 待機画面でチームメンバーをリアルタイム取得
  useEffect(() => {
    if (screen === 'waiting' && selectedTeam) {
      fetchTeamMembers()
      
      // Supabaseのリアルタイム更新を設定
      const channel = supabase
        .channel(`team-${selectedTeam.id}-members`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'members',
            filter: `team_id=eq.${selectedTeam.id}`
          },
          (payload) => {
            console.log('リアルタイム更新:', payload)
            fetchTeamMembers()
          }
        )
        .subscribe((status) => {
          console.log('サブスクリプション状態:', status)
        })
      
      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [screen, selectedTeam])

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('total_score', { ascending: false })
    
    if (error) {
      console.error('Error fetching teams:', error)
    } else {
      setTeams(data || [])
    }
  }

  const fetchTeamRankings = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('total_score', { ascending: false })
    
    if (error) {
      console.error('Error fetching team rankings:', error)
    } else {
      setTeamRankings(data || [])
    }
  }

  const fetchTeamMembers = async () => {
    if (!selectedTeam) return
    
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('team_id', selectedTeam.id)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching team members:', error)
    } else {
      setTeamMembers(data || [])
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return
    
    // チーム数をチェック
    const { data: existingTeams, error: countError } = await supabase
      .from('teams')
      .select('id')
    
    if (countError) {
      console.error('Error checking team count:', countError)
      alert('エラーが発生しました。もう一度お試しください。')
      return
    }
    
    if (existingTeams && existingTeams.length >= 15) {
      alert('チーム数が上限（15チーム）に達しています。既存のチームを選択してください。')
      return
    }
    
    const { data, error } = await supabase
      .from('teams')
      .insert([{ name: newTeamName, total_score: 0 }])
      .select()
    
    if (error) {
      console.error('Error creating team:', error)
      alert('チーム名が既に存在します。別の名前を入力してください。')
    } else {
      setSelectedTeam(data[0])
      setNewTeamName('')
      fetchTeams()
      setScreen('register')
    }
  }

  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
    setScreen('register')
  }

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !selectedTeam) {
      alert('ユーザー名とパスワード（3桁）を入力してください。')
      return
    }
    
    if (password.length !== 3 || !/^\d{3}$/.test(password)) {
      alert('パスワードは3桁の数字で入力してください。')
      return
    }
    
    if (isLogin) {
      // ログイン処理
      const { data: existingMembers, error } = await supabase
        .from('members')
        .select('*, teams(*)')
        .eq('name', username)
      
      if (error || !existingMembers || existingMembers.length === 0) {
        alert('ユーザー名が見つかりません。新規登録してください。')
        return
      }
      
      const existingMember = existingMembers[0]
      
      if (existingMember.password !== password) {
        alert('パスワードが間違っています。')
        return
      }
      
      // ログイン成功
      setSelectedTeam(existingMember.teams)
      alert(`ようこそ、${username}さん！前回のスコア: ${existingMember.score}点`)
      
      // マスターアカウントの場合は直接クイズへ
      if (username === 'kawase' && password === '123') {
        setScreen('quiz')
      } else {
        setScreen('waiting')
      }
    } else {
      // 新規登録処理
      // ユーザー名の重複チェック
      const { data: existingUsers, error: checkError } = await supabase
        .from('members')
        .select('id')
        .eq('name', username)
      
      if (existingUsers && existingUsers.length > 0) {
        alert('このユーザー名は既に使用されています。ログインするか、別の名前を選んでください。')
        return
      }
      
      // チームのメンバー数をチェック
      const { data: members, error } = await supabase
        .from('members')
        .select('id')
        .eq('team_id', selectedTeam.id)
      
      if (error) {
        console.error('Error checking team members:', error)
        alert('エラーが発生しました。もう一度お試しください。')
        return
      }
      
      if (members && members.length >= 10) {
        alert('このチームは既に10人のメンバーが登録されています。別のチームを選択してください。')
        setScreen('team_select')
        return
      }
      
      // メンバーをデータベースに登録
      const { data: newMembers, error: insertError } = await supabase
        .from('members')
        .insert([{
          name: username,
          password: password,
          team_id: selectedTeam.id,
          score: 0
        }])
        .select()
      
      if (insertError || !newMembers || newMembers.length === 0) {
        console.error('Error inserting member:', insertError)
        alert('登録に失敗しました。もう一度お試しください。')
        return
      }
      
      const newMember = newMembers[0]
      
      // マスターアカウント（kawase / 123）の場合は直接クイズへ
      const isMasterAccount = username === 'kawase' && password === '123'
      
      if (isMasterAccount) {
        setScreen('quiz')
      } else {
        setScreen('waiting')
      }
    }
  }

  const handleStartQuiz = () => {
    setScreen('quiz')
  }

  const handleAnswer = async (answerIndex) => {
    if (showFeedback) return
    
    const currentQuiz = QUIZ_DATA[currentQuestion]
    const correct = answerIndex === currentQuiz.answer
    
    setAnswers([...answers, { question: currentQuestion, answer: answerIndex, correct }])
    
    if (correct) {
      setScore(score + 1)
    }
    
    setLastAnswerCorrect(correct)
    setShowFeedback(true)

    setTimeout(async () => {
      setShowFeedback(false)
      if (currentQuestion < QUIZ_DATA.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        const finalScore = correct ? score + 1 : score
        
        // メンバーをデータベースに追加（新規登録の場合のみ）
        if (!isLogin) {
          const { data: memberData, error: memberError } = await supabase
            .from('members')
            .insert([{
              name: username,
              team_id: selectedTeam.id,
              score: finalScore,
              password: password
            }])
            .select()
          
          if (memberError) {
            console.error('Error adding member:', memberError)
          }
        } else {
          // ログインユーザーのスコアを更新
          const { error: updateError } = await supabase
            .from('members')
            .update({ score: finalScore })
            .eq('name', username)
          
          if (updateError) {
            console.error('Error updating member score:', updateError)
          }
        }

        // チームの合計得点を更新
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .update({ total_score: selectedTeam.total_score + finalScore })
          .eq('id', selectedTeam.id)
          .select()
        
        if (teamError) {
          console.error('Error updating team score:', teamError)
        }
        
        await fetchTeamRankings()
        
        // チームの合計スコアを取得
        const { data: teamMembersData, error: membersError } = await supabase
          .from('members')
          .select('score')
          .eq('team_id', selectedTeam.id)
        
        if (!membersError && teamMembersData) {
          const total = teamMembersData.reduce((sum, member) => sum + (member.score || 0), 0)
          setTeamTotalScore(total)
        }
        
        setScreen('result')
      }
    }, 1500)
  }

  const handleReset = () => {
    setScreen('team_select')
    setSelectedTeam(null)
    setUsername('')
    setPassword('')
    setIsLogin(false)
    setCurrentQuestion(0)
    setScore(0)
    setAnswers([])
    setShowFeedback(false)
    setLastAnswerCorrect(false)
    fetchTeams()
  }

  const currentQuiz = QUIZ_DATA[currentQuestion]

  // チーム選択画面
  if (screen === 'team_select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-600 p-4 rounded-full">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-indigo-900">チームを選択</CardTitle>
            <CardDescription className="text-lg">既存のチームを選ぶか、新しいチームを作成してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">新しいチームを作成</h3>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="チーム名を入力"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateTeam()}
                  className="text-lg p-6"
                />
                <Button 
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim()}
                  className="text-lg py-6 px-8 bg-indigo-600 hover:bg-indigo-700"
                >
                  作成
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">既存のチームを選択</h3>
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {teams.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">まだチームがありません</p>
                ) : (
                  teams.map((team) => (
                    <Button
                      key={team.id}
                      onClick={() => handleSelectTeam(team)}
                      variant="outline"
                      className="w-full text-left justify-between p-6 hover:bg-indigo-50"
                    >
                      <span className="text-lg font-semibold">{team.name}</span>
                      <span className="text-indigo-600 font-bold">{team.total_score}点</span>
                    </Button>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // メンバー登録画面
  if (screen === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-600 p-4 rounded-full">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-indigo-900">メンバー登録</CardTitle>
            <CardDescription className="text-lg">
              チーム: <span className="font-bold text-indigo-600">{selectedTeam?.name}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={() => setIsLogin(false)}
                  variant={!isLogin ? "default" : "outline"}
                  className="flex-1"
                >
                  新規登録
                </Button>
                <Button
                  onClick={() => setIsLogin(true)}
                  variant={isLogin ? "default" : "outline"}
                  className="flex-1"
                >
                  ログイン
                </Button>
              </div>
              <Input
                type="text"
                placeholder="ユーザー名を入力"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-lg p-6"
              />
              <Input
                type="password"
                placeholder="パスワード（3桁の数字）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                maxLength={3}
                className="text-lg p-6"
              />
              {!isLogin && (
                <p className="text-sm text-gray-600">
                  ※ パスワードは3桁の数字で設定してください（例: 123）
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              onClick={() => {
                setScreen('team_select')
                setPassword('')
                setIsLogin(false)
              }}
              variant="outline"
              className="flex-1 text-lg py-6"
            >
              戻る
            </Button>
            <Button 
              onClick={handleRegister} 
              disabled={!username.trim() || !password.trim()}
              className="flex-1 text-lg py-6 bg-indigo-600 hover:bg-indigo-700"
            >
              {isLogin ? 'ログイン' : 'スタート'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // 待機画面
  if (screen === 'waiting') {
    const memberCount = teamMembers.length
    const canStart = memberCount >= 5
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-600 p-4 rounded-full">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-indigo-900">
              {canStart ? 'メンバーが揃いました！' : '待機中...'}
            </CardTitle>
            <CardDescription className="text-lg">
              チーム: <span className="font-bold text-indigo-600">{selectedTeam?.name}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600 mb-2">
                {memberCount} / 10人
              </p>
              {!canStart && (
                <p className="text-gray-600">
                  クイズを開始するには最低5人必要です
                  <br />
                  あと {5 - memberCount} 人待っています...
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-center">登録済みメンバー</h3>
              <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
                {teamMembers.length === 0 ? (
                  <p className="text-gray-500 text-center">メンバーがいません</p>
                ) : (
                  <ul className="space-y-2">
                    {teamMembers.map((member, index) => (
                      <li
                        key={member.id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          member.name === username
                            ? 'bg-indigo-100 border-2 border-indigo-500'
                            : 'bg-gray-50'
                        }`}
                      >
                        <User className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold">
                          {index + 1}. {member.name}
                          {member.name === username && ' (あなた)'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              onClick={() => {
                setScreen('team_select')
                setUsername('')
                setPassword('')
              }}
              variant="outline"
              className="flex-1 text-lg py-6"
            >
              戻る
            </Button>
            <Button
              onClick={handleStartQuiz}
              disabled={!canStart}
              className="flex-1 text-lg py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300"
            >
              {canStart ? 'クイズを開始する' : '人数が足りません'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // クイズ画面（既存のコードを使用）
  if (screen === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                問題 {currentQuestion + 1} / {QUIZ_DATA.length}
              </span>
              <span className="text-sm font-semibold text-indigo-600">
                {username} ({selectedTeam?.name})
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / QUIZ_DATA.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <CardTitle className="text-xl md:text-2xl text-center py-4 whitespace-pre-line">
              {currentQuiz.question}
            </CardTitle>
            
            {currentQuiz.type === 'image' && (
              <div className="flex justify-center mb-4">
                <img src={currentQuiz.image} alt={`Question ${currentQuestion + 1}`} className="max-w-full h-auto rounded-lg shadow-lg" />
              </div>
            )}
            
            {currentQuiz.type === 'image_comparison' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="font-bold mb-2">A</p>
                  <img src={currentQuiz.imageA} alt="Option A" className="w-full h-auto rounded-lg shadow-lg" />
                </div>
                <div className="text-center">
                  <p className="font-bold mb-2">B</p>
                  <img src={currentQuiz.imageB} alt="Option B" className="w-full h-auto rounded-lg shadow-lg" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {currentQuiz.type === 'multiple' && currentQuiz.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`p-6 text-left justify-start h-auto whitespace-normal ${
                    showFeedback
                      ? index === currentQuiz.answer
                        ? 'bg-green-500 hover:bg-green-600'
                        : answers[answers.length - 1]?.answer === index
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gray-300'
                      : 'bg-white hover:bg-indigo-50 text-gray-900'
                  }`}
                  variant={showFeedback ? 'default' : 'outline'}
                >
                  <span className="font-bold mr-3">{['①', '②', '③', '④'][index]}</span>
                  <span className="text-base">{option}</span>
                </Button>
              ))}
              
              {(currentQuiz.type === 'image' || currentQuiz.type === 'image_comparison') && (
                <>
                  <Button
                    onClick={() => handleAnswer(0)}
                    disabled={showFeedback}
                    className={`p-6 text-lg ${
                      showFeedback
                        ? currentQuiz.answer === 0
                          ? 'bg-green-500 hover:bg-green-600'
                          : answers[answers.length - 1]?.answer === 0
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-300'
                        : 'bg-white hover:bg-indigo-50 text-gray-900'
                    }`}
                    variant={showFeedback ? 'default' : 'outline'}
                  >
                    A
                  </Button>
                  <Button
                    onClick={() => handleAnswer(1)}
                    disabled={showFeedback}
                    className={`p-6 text-lg ${
                      showFeedback
                        ? currentQuiz.answer === 1
                          ? 'bg-green-500 hover:bg-green-600'
                          : answers[answers.length - 1]?.answer === 1
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-300'
                        : 'bg-white hover:bg-indigo-50 text-gray-900'
                    }`}
                    variant={showFeedback ? 'default' : 'outline'}
                  >
                    B
                  </Button>
                </>
              )}
              
              {currentQuiz.type === 'text_comparison' && (
                <>
                  <Button
                    onClick={() => handleAnswer(0)}
                    disabled={showFeedback}
                    className={`p-6 text-left justify-start h-auto whitespace-normal ${
                      showFeedback
                        ? currentQuiz.answer === 0
                          ? 'bg-green-500 hover:bg-green-600'
                          : answers[answers.length - 1]?.answer === 0
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-300'
                        : 'bg-white hover:bg-indigo-50 text-gray-900'
                    }`}
                    variant={showFeedback ? 'default' : 'outline'}
                  >
                    <div>
                      <p className="font-bold mb-2">文章A</p>
                      <p className="text-sm">{currentQuiz.textA}</p>
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleAnswer(1)}
                    disabled={showFeedback}
                    className={`p-6 text-left justify-start h-auto whitespace-normal ${
                      showFeedback
                        ? currentQuiz.answer === 1
                          ? 'bg-green-500 hover:bg-green-600'
                          : answers[answers.length - 1]?.answer === 1
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-300'
                        : 'bg-white hover:bg-indigo-50 text-gray-900'
                    }`}
                    variant={showFeedback ? 'default' : 'outline'}
                  >
                    <div>
                      <p className="font-bold mb-2">文章B</p>
                      <p className="text-sm">{currentQuiz.textB}</p>
                    </div>
                  </Button>
                </>
              )}
            </div>

            {showFeedback && (
              <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
                lastAnswerCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {lastAnswerCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold text-lg">正解！</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" />
                    <span className="font-bold text-lg">不正解</span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // 結果画面
  if (screen === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-4 rounded-full">
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-indigo-900 mb-2">クイズ完了！</CardTitle>
            <CardDescription className="text-xl">
              {username}さん ({selectedTeam?.name})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
              <p className="text-2xl mb-2">チームの合計スコア</p>
              <p className="text-6xl font-bold">{teamTotalScore}点</p>
              <p className="text-xl mt-4">あなたのスコア: {score} / {QUIZ_DATA.length} (正答率: {Math.round((score / QUIZ_DATA.length) * 100)}%)</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-center">チームランキング</h3>
              <div className="space-y-2">
                {teamRankings.map((team, index) => (
                  <div
                    key={team.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      team.id === selectedTeam?.id
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-lg font-semibold">{team.name}</span>
                    </div>
                    <span className="text-xl font-bold text-indigo-600">{team.total_score}点</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleReset}
              className="w-full text-lg py-6 bg-indigo-600 hover:bg-indigo-700"
            >
              最初に戻る
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return null
}

export default App
