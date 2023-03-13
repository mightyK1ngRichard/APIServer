# Nodejs server
Так как на swift проблематично работать с postgresql, я буду использовать этот серавак и передавать данные чтения таблицы в формате json по API.

## Пример работы с API на языке Swift:


```swift
override func viewDidLoad() {
        super.viewDidLoad()
        let query = """
        SELECT *
        FROM coordinates;
        """
        APIManager.shared.getNews(SQLQuery: query) {[weak self] data, error in
            guard let self = self else { return }
            guard let data = data else {
                // ... Можно добавить какой-то паттерн вывод лейблов.
                print("ERROR: ", error!)
                return
            }
            
            DispatchQueue.main.async{
                // ... work with the data here.
            }
        }
```

```swift
class APIManager {
    static let shared = APIManager()
    let host = "localhost"
    let port = 8080
    
    func getNews(SQLQuery: String, completion: @escaping (String?, String?) -> Void) {
        let SQLQueryInCorrectForm = SQLQuery.replacingOccurrences(of: " ", with: "%20").replacingOccurrences(of: "\n", with: "%20")
        let urlString = "http://\(host):\(port)/database/\(SQLQueryInCorrectForm)"
        guard let url = URL(string: urlString) else {
            completion(nil, "Uncorrected url")
            return
        }
        let request = URLRequest(url: url)
        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data else {
                completion(nil, "Data is empty")
                return
            }
            
            // ... Сделать механизм распарсинга.
            completion(String(decoding: data, as: UTF8.self), nil)
        }.resume()
    }
}

```
