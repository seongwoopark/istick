int X = 0;
int Y = 1;
int A = 2;
int B = 3;
int C = 4;
int D = 5;

void setup() {
  pinMode(X, INPUT);
  pinMode(Y, INPUT);
  pinMode(A, INPUT);
  pinMode(B, INPUT);
  pinMode(C, INPUT);
  pinMode(D, INPUT); 
  Serial.begin(9600);
}

void loop() {
  Serial.print("X");
  Serial.print("\n");
  Serial.print(analogRead(X));
  Serial.print("\n");
  
  Serial.print("Y");
  Serial.print("\n");
  Serial.print(analogRead(Y));
  Serial.print("\n");
  
  Serial.print("A");
  Serial.print("\n");
  Serial.print(digitalRead(A));
  Serial.print("\n");

  Serial.print("B");
  Serial.print("\n");
  Serial.print(digitalRead(B));
  Serial.print("\n");
  
  Serial.print("C");
  Serial.print("\n");
  Serial.print(digitalRead(C));
  Serial.print("\n");
  
  Serial.print("D");
  Serial.print("\n");
  Serial.print(digitalRead(D));
  Serial.print("\n");
}
