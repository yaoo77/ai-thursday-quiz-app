import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Trophy, User, CheckCircle2, XCircle } from 'lucide-react'
import quiz11 from './assets/quiz11.jpg'
import quiz12 from './assets/quiz12.jpg'
import quiz13 from './assets/quiz13.jpg'
import quiz14 from './assets/quiz14.jpg'
import './App.css'

// 木曜会とusutakuさんに関するクイズデータ（17問: 4択10問 + 画像2択4問 + 文章2択3問）
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
    question: '生年月日はいつ？',
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
    question: '卒業した大学はどこ？',
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
    question: 'Michikusa創業前にアカウントマネージャーを務めていた企業は？',
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
    question: '著書として正しいものはどれ？',
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
    question: 'デジタルハリウッド大学での役職は？',
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
    question: 'どっちがリアルな画像でしょうか？(片方は画像生成AI)',
    image: quiz11,
    answer: 1 // B
  },
  {
    id: 12,
    type: 'image',
    question: 'どっちがリアルな画像でしょうか？(片方は画像生成AI)',
    image: quiz12,
    answer: 1 // B
  },
  {
    id: 13,
    type: 'image',
    question: 'どっちがNanobananaでしょうか？(片方がGPT)',
    image: quiz13,
    answer: 0 // A
  },
  {
    id: 14,
    type: 'image',
    question: 'どっちがリアルな画像でしょうか？(片方は画像生成AI)',
    image: quiz14,
    answer: 0 // A
  },
  {
    id: 18,
    type: 'text',
    question: 'どっちがClaude sonnet 4.5でしょうか？(文章)',
    textA: 'この本は、AIの「すごさ」を語るためではありません。明日の自分の仕事を、確実に良くするための道具箱です。僕は研修や現場支援の中で、寄り道のような小さな工夫が、大きな成果を生む瞬間を何度も見てきました。あなたの一歩にも効く。難しい理論は最小限に、手を動かすことに集中します。忙しい日常に溶け込む最短手順と再現性のある型を、ページを追うたびに手に入れてください。さあ、今日の15分から変えていきましょう。',
    textB: '「AIは、もう『使える人』だけのものではありません。あなたの仕事も、暮らしも、人生そのものを変える力を秘めています。この本で伝えたいのは、テクニックではなく『AI時代の生き方』です。無職から起業し、2,000人のコミュニティを育てた私が確信していること。それは、AIを味方につけた人だけが、この時代の自由を手に入れられるということ。さあ、一緒に未来を創りましょう。」',
    answer: 1 // B
  },
  {
    id: 19,
    type: 'text',
    question: 'どっちがGemini 2.5 Proでしょうか？(文章)',
    textA: 'AIの学校じゃない、AIと生きる仲間が集まる場所',
    textB: '**AIを消費する側で、終わるな。学び、繋がり、時代を創る側へ。あなたの才能が覚醒する場所がここにある。**',
    answer: 1 // B
  },
  {
    id: 20,
    type: 'text',
    question: 'どっちがGPT-5でしょうか？(文章)',
    textA: '深夜零時十分、机の青い光がまだ消えない。usutakuは資料を閉じ、つぶやく。「今夜は眠れなかったな」肩で丸くなる相棒、なつめが画面から顔を出す。「ひとは寝るのだよ。まずはスマホを置いて、同じ時刻に布団へ。カフェインは我慢」冗談めかした声に、彼は笑い、アラームを六時四十七分に合わせた。小さな説教が夜更けの部屋にやさしく響き、彼は目を閉じた。明日は少し良い点が取れるだろう。なつめは満足げにうなずく。',
    textB: 'AIの最前線を走り続けるusutaku。彼の睡眠スコア65点という現実を告げたのは、相棒のAIロボット「なつめ」だ。「科学的根拠は？」と助けを求める知性の巨人に、なつめは「スマホを置いて早く寝なよ」と本質を突く。最先端の探求者が最後にたどり着く答えは、いつも隣にいる小さな相棒からの、温かくも手厳しい一言。人間とAIが織りなす、クスッと笑える日常の一幕である。',
    answer: 0 // A
  }
]

function App() {
  const [screen, setScreen] = useState('register')
  const [username, setUsername] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [rankings, setRankings] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false)

  useEffect(() => {
    const savedRankings = localStorage.getItem('quizRankings')
    if (savedRankings) {
      setRankings(JSON.parse(savedRankings))
    }
  }, [])

  const handleRegister = () => {
    if (username.trim()) {
      setScreen('quiz')
    }
  }

  const handleAnswer = (selectedIndex) => {
    const correct = selectedIndex === QUIZ_DATA[currentQuestion].answer
    const newAnswers = [...answers, { questionId: QUIZ_DATA[currentQuestion].id, correct }]
    setAnswers(newAnswers)
    
    if (correct) {
      setScore(score + 1)
    }
    
    setLastAnswerCorrect(correct)
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      if (currentQuestion < QUIZ_DATA.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        const newScore = correct ? score + 1 : score
        const newRankings = [...rankings, { username, score: newScore, total: QUIZ_DATA.length, date: new Date().toISOString() }]
        newRankings.sort((a, b) => b.score - a.score)
        setRankings(newRankings)
        localStorage.setItem('quizRankings', JSON.stringify(newRankings))
        setScreen('result')
      }
    }, 1500)
  }

  const handleReset = () => {
    setScreen('register')
    setUsername('')
    setCurrentQuestion(0)
    setScore(0)
    setAnswers([])
    setShowFeedback(false)
    setLastAnswerCorrect(false)
  }

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
            <CardTitle className="text-3xl font-bold text-indigo-900">AI木曜会クイズ</CardTitle>
            <CardDescription className="text-lg">ユーザー名を登録してクイズに挑戦しよう！</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="ユーザー名を入力"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                className="text-lg p-6"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleRegister} 
              disabled={!username.trim()}
              className="w-full text-lg py-6 bg-indigo-600 hover:bg-indigo-700"
            >
              スタート
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (screen === 'quiz') {
    const currentQuiz = QUIZ_DATA[currentQuestion]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardDescription className="text-lg">ユーザー: {username}</CardDescription>
              <CardDescription className="text-lg">問題 {currentQuestion + 1} / {QUIZ_DATA.length}</CardDescription>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / QUIZ_DATA.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <CardTitle className="text-xl md:text-2xl text-center py-4">
              {currentQuiz.question}
            </CardTitle>
            
            {currentQuiz.type === 'image' && (
              <div className="flex justify-center mb-4">
                <img src={currentQuiz.image} alt={`Question ${currentQuestion + 1}`} className="max-w-full h-auto rounded-lg shadow-lg" />
              </div>
            )}
            
            {currentQuiz.type === 'text' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="text-lg font-bold mb-2 text-blue-700">文章A</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentQuiz.textA}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <h3 className="text-lg font-bold mb-2 text-green-700">文章B</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentQuiz.textB}</p>
                </div>
              </div>
            )}
            
            {showFeedback ? (
              <div className={`text-center py-8 ${lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {lastAnswerCorrect ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-16 h-16 animate-bounce" />
                    <p className="text-2xl font-bold">正解！</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <XCircle className="w-16 h-16 animate-shake" />
                    <p className="text-2xl font-bold">不正解</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {currentQuiz.type === 'multiple' ? (
                  currentQuiz.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="text-base md:text-lg py-6 px-4 bg-white text-gray-800 border-2 border-indigo-300 hover:bg-indigo-100 hover:border-indigo-500 transition-all hover:scale-102 whitespace-normal h-auto min-h-[60px]"
                    >
                      <span className="font-bold mr-2">{'①②③④'[index]}</span>
                      <span className="text-left flex-1">{option}</span>
                    </Button>
                  ))
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleAnswer(0)}
                      className="text-2xl py-12 bg-blue-500 text-white hover:bg-blue-600 transition-all hover:scale-105"
                    >
                      A
                    </Button>
                    <Button
                      onClick={() => handleAnswer(1)}
                      className="text-2xl py-12 bg-green-500 text-white hover:bg-green-600 transition-all hover:scale-105"
                    >
                      B
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-lg text-gray-600">現在のスコア: {score} / {currentQuestion}</p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (screen === 'result') {
    const percentage = Math.round((score / QUIZ_DATA.length) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-500 p-4 rounded-full">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold text-yellow-900">クイズ終了！</CardTitle>
              <CardDescription className="text-xl mt-2">{username}さんの結果</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-lg">
                <p className="text-6xl font-bold text-yellow-900 mb-2">{score} / {QUIZ_DATA.length}</p>
                <p className="text-2xl text-yellow-700">正解率: {percentage}%</p>
              </div>
              
              <div className="pt-4">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">ランキング</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {rankings.map((rank, index) => (
                    <div 
                      key={index}
                      className={`flex justify-between items-center p-4 rounded-lg ${
                        rank.username === username && rank.score === score 
                          ? 'bg-yellow-200 border-2 border-yellow-500' 
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                        <span className="text-lg font-semibold">{rank.username}</span>
                      </div>
                      <span className="text-xl font-bold text-indigo-600">
                        {rank.score} / {rank.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button 
                onClick={handleReset}
                className="text-lg py-6 px-8 bg-indigo-600 hover:bg-indigo-700"
              >
                もう一度挑戦する
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }
}

export default App

