import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Trophy, User, CheckCircle2, XCircle } from 'lucide-react'
import './App.css'

// ダミーの問題データ（15問）
const QUIZ_DATA = [
  { id: 1, question: "日本の首都は東京である", answer: true },
  { id: 2, question: "地球は太陽の周りを回っている", answer: true },
  { id: 3, question: "1週間は8日である", answer: false },
  { id: 4, question: "富士山は日本で一番高い山である", answer: true },
  { id: 5, question: "猫は犬より大きい", answer: false },
  { id: 6, question: "水は100度で沸騰する", answer: true },
  { id: 7, question: "1年は365日である", answer: true },
  { id: 8, question: "月は地球より大きい", answer: false },
  { id: 9, question: "日本は島国である", answer: true },
  { id: 10, question: "冬は夏より暑い", answer: false },
  { id: 11, question: "人間には5本の指がある", answer: true },
  { id: 12, question: "太陽は西から昇る", answer: false },
  { id: 13, question: "日本語は日本で話されている", answer: true },
  { id: 14, question: "氷は水より重い", answer: false },
  { id: 15, question: "1時間は60分である", answer: true }
]

function App() {
  const [screen, setScreen] = useState('register') // register, quiz, result
  const [username, setUsername] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [rankings, setRankings] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false)

  // ランキングデータの読み込み
  useEffect(() => {
    const savedRankings = localStorage.getItem('quizRankings')
    if (savedRankings) {
      setRankings(JSON.parse(savedRankings))
    }
  }, [])

  // ユーザー登録
  const handleRegister = () => {
    if (username.trim()) {
      setScreen('quiz')
    }
  }

  // 回答処理
  const handleAnswer = (userAnswer) => {
    const correct = userAnswer === QUIZ_DATA[currentQuestion].answer
    const newAnswers = [...answers, { questionId: QUIZ_DATA[currentQuestion].id, correct }]
    setAnswers(newAnswers)
    
    if (correct) {
      setScore(score + 1)
    }
    
    setLastAnswerCorrect(correct)
    setShowFeedback(true)

    // フィードバック表示後に次の問題へ
    setTimeout(() => {
      setShowFeedback(false)
      if (currentQuestion < QUIZ_DATA.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // クイズ終了、結果を保存
        const newScore = correct ? score + 1 : score
        const newRankings = [...rankings, { username, score: newScore, total: QUIZ_DATA.length, date: new Date().toISOString() }]
        newRankings.sort((a, b) => b.score - a.score)
        setRankings(newRankings)
        localStorage.setItem('quizRankings', JSON.stringify(newRankings))
        setScreen('result')
      }
    }, 1000)
  }

  // リセット
  const handleReset = () => {
    setScreen('register')
    setUsername('')
    setCurrentQuestion(0)
    setScore(0)
    setAnswers([])
    setShowFeedback(false)
    setLastAnswerCorrect(false)
  }

  // 登録画面
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
            <CardTitle className="text-3xl font-bold text-indigo-900">クイズアプリ</CardTitle>
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

  // クイズ画面
  if (screen === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
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
            <CardTitle className="text-2xl md:text-3xl text-center py-8">
              {QUIZ_DATA[currentQuestion].question}
            </CardTitle>
            
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleAnswer(true)}
                  className="text-xl py-8 bg-green-600 hover:bg-green-700 transition-all hover:scale-105"
                >
                  ○ 正しい
                </Button>
                <Button 
                  onClick={() => handleAnswer(false)}
                  className="text-xl py-8 bg-red-600 hover:bg-red-700 transition-all hover:scale-105"
                >
                  × 間違い
                </Button>
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

  // 結果画面
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

