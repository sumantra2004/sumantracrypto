// Pure Vanilla JavaScript - Enhanced with Authentication and Visualizations
class CryptoSystem {
  constructor() {
    this.isAuthenticated = false
    this.attempts = 3
    this.selectedFile = null
    this.lastOperation = null
    this.processingStartTime = null

    this.initializeAuthentication()
    this.initializeEventListeners()
    this.initializeVisualizations()
  }

  initializeAuthentication() {
    // Show authentication modal on load
    document.getElementById("authModal").style.display = "flex"

    // Authentication event listeners
    document.getElementById("authenticateBtn").addEventListener("click", () => this.authenticate())
    document.getElementById("masterKey").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.authenticate()
    })
    document.getElementById("logoutBtn").addEventListener("click", () => this.logout())

    // Focus on key input
    document.getElementById("masterKey").focus()
  }

  async authenticate() {
    const keyInput = document.getElementById("masterKey")
    const key = keyInput.value.trim()

    if (!key) {
      this.showAuthError("Please enter the master key")
      return
    }

    try {
      const response = await fetch("/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: key }),
      })

      const result = await response.json()

      if (result.success && result.access_granted) {
        this.isAuthenticated = true
        document.getElementById("authModal").style.display = "none"
        document.getElementById("mainApp").style.display = "block"
        this.showEnhancedStatus("🎉 Welcome to the Cryptographic System!", "success", "Authentication Successful")
        this.startVisualizationAnimations()
      } else {
        this.attempts--
        if (this.attempts > 0) {
          this.showAuthError(`Invalid key. ${this.attempts} attempts remaining.`)
          document.getElementById("authAttempts").style.display = "block"
          document.getElementById("attemptsCount").textContent = this.attempts
        } else {
          this.showAuthError("Access denied. Too many failed attempts.")
          document.getElementById("authenticateBtn").disabled = true
        }
        keyInput.value = ""
      }
    } catch (error) {
      this.showAuthError("Authentication failed. Please try again.")
    }
  }

  logout() {
    this.isAuthenticated = false
    document.getElementById("mainApp").style.display = "none"
    document.getElementById("authModal").style.display = "flex"
    document.getElementById("masterKey").value = ""
    document.getElementById("masterKey").focus()
    this.attempts = 3
    document.getElementById("authAttempts").style.display = "none"
    document.getElementById("authenticateBtn").disabled = false
  }

  showAuthError(message) {
    // Create temporary error message
    const errorDiv = document.createElement("div")
    errorDiv.className = "auth-error"
    errorDiv.style.cssText = `
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      margin-top: 15px;
      text-align: center;
      font-weight: 500;
      animation: shake 0.5s ease-in-out;
    `
    errorDiv.textContent = message

    // Add shake animation
    const style = document.createElement("style")
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `
    document.head.appendChild(style)

    const authForm = document.querySelector(".auth-form")
    const existingError = authForm.querySelector(".auth-error")
    if (existingError) existingError.remove()

    authForm.appendChild(errorDiv)

    setTimeout(() => {
      errorDiv.remove()
    }, 3000)
  }

  initializeEventListeners() {
    // Text encryption buttons
    document.getElementById("encryptTextBtn").addEventListener("click", () => this.encryptText())
    document.getElementById("decryptTextBtn").addEventListener("click", () => this.decryptText())
    document.getElementById("clearTextBtn").addEventListener("click", () => this.clearText())

    // File upload handling
    const uploadArea = document.getElementById("uploadArea")
    const fileInput = document.getElementById("fileInput")

    uploadArea.addEventListener("click", () => fileInput.click())
    uploadArea.addEventListener("dragover", this.handleDragOver.bind(this))
    uploadArea.addEventListener("dragleave", this.handleDragLeave.bind(this))
    uploadArea.addEventListener("drop", this.handleDrop.bind(this))

    fileInput.addEventListener("change", (e) => this.handleFileSelect(e.target.files[0]))

    // File encryption buttons
    document.getElementById("encryptFileBtn").addEventListener("click", () => this.encryptFile())
    document.getElementById("decryptFileBtn").addEventListener("click", () => this.decryptFile())
    document.getElementById("clearFileBtn").addEventListener("click", () => this.clearFile())

    // Download button
    document.getElementById("downloadBtn").addEventListener("click", () => this.downloadResult())

    // Algorithm change for RSA warning
    document.getElementById("textAlgorithm").addEventListener("change", this.checkRSALimitation.bind(this))

    // Character counter
    document.getElementById("textInput").addEventListener("input", (e) => {
      const charCount = e.target.value.length
      document.getElementById("charCounter").textContent = `${charCount} characters`
      this.updateVisualization("input", e.target.value)
    })

    // Copy to clipboard
    document.getElementById("copyResultBtn").addEventListener("click", () => {
      const output = document.getElementById("textOutput")
      output.select()
      document.execCommand("copy")
      this.showEnhancedStatus("📋 Copied to clipboard!", "success", "Text copied successfully")
    })

    // Algorithm tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.switchAlgorithmTab(e.target.dataset.algorithm)
      })
    })

    // Toast close button
    document.getElementById("toastClose").addEventListener("click", () => {
      document.getElementById("statusToast").style.display = "none"
    })
  }

  initializeVisualizations() {
    // Initialize algorithm comparison charts
    this.animateChartBars()

    // Set up process flow
    this.resetProcessFlow()
  }

  startVisualizationAnimations() {
    // Animate floating shapes
    document.querySelectorAll(".shape").forEach((shape, index) => {
      shape.style.animationDelay = `${index * -2}s`
    })

    // Animate algorithm cards
    document.querySelectorAll(".algorithm-card").forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = "fadeInUp 0.6s ease forwards"
      }, index * 200)
    })
  }

  switchAlgorithmTab(algorithm) {
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-algorithm="${algorithm}"]`).classList.add("active")

    // Update panels
    document.querySelectorAll(".algorithm-panel").forEach((panel) => {
      panel.classList.remove("active")
    })
    document.getElementById(`${algorithm}-panel`).classList.add("active")
  }

  animateChartBars() {
    const bars = document.querySelectorAll(".bar-fill")
    bars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.style.width
        bar.style.width = "0%"
        setTimeout(() => {
          bar.style.width = width
        }, 100)
      }, index * 200)
    })
  }

  updateVisualization(step, data) {
    const steps = {
      input: "step1",
      key: "step2",
      algorithm: "step3",
      output: "step4",
    }

    // Reset all steps
    document.querySelectorAll(".flow-step").forEach((step) => {
      step.classList.remove("active")
    })

    // Activate current step
    if (steps[step]) {
      document.getElementById(steps[step]).classList.add("active")

      // Update step data
      const stepData = document.querySelector(`#${steps[step]} .step-data`)
      if (stepData) {
        stepData.textContent = data.length > 50 ? data.substring(0, 50) + "..." : data
      }
    }
  }

  // Live Encryption Visualization Methods
  showLiveVisualization(algorithm, isDecryption = false) {
    const container = document.getElementById("liveProcessContainer")
    const algorithmBadge = document.getElementById("currentAlgorithm")
    const symmetricProcess = document.getElementById("symmetricProcess")
    const asymmetricProcess = document.getElementById("asymmetricProcess")

    // Show container and set algorithm
    container.style.display = "block"
    algorithmBadge.textContent = algorithm
    algorithmBadge.className = `algorithm-badge ${algorithm}`

    // Show appropriate process visualization
    if (algorithm === "RSA") {
      symmetricProcess.style.display = "none"
      asymmetricProcess.style.display = "block"
      this.resetRSAVisualization()
    } else {
      symmetricProcess.style.display = "block"
      asymmetricProcess.style.display = "none"
      this.resetSymmetricVisualization(algorithm)
    }

    // Hide summary initially
    document.getElementById("processSummary").style.display = "none"

    // Start timer
    this.visualizationStartTime = Date.now()
    this.updateTimer()
  }

  resetSymmetricVisualization(algorithm) {
    // Reset all steps
    const steps = ["input", "padding", "key", "encrypt", "output"]
    steps.forEach((step) => {
      const stepElement = document.getElementById(`step-${step}`)
      const statusElement = document.getElementById(`status-${step}`)

      stepElement.classList.remove("active", "completed")
      statusElement.textContent = "⏳"
    })

    // Reset connectors
    document.querySelectorAll(".flow-connector").forEach((connector) => {
      connector.classList.remove("active")
    })

    // Set algorithm-specific values
    if (algorithm === "AES") {
      document.getElementById("encryptionKey").textContent = "sumantrasumantra"
      document.getElementById("blockSize").textContent = "16 bytes (AES)"
    } else if (algorithm === "DES") {
      document.getElementById("encryptionKey").textContent = "sumantra"
      document.getElementById("blockSize").textContent = "8 bytes (DES)"
    }

    // Reset data values
    document.getElementById("inputTextValue").textContent = "Waiting..."
    document.getElementById("paddedValue").textContent = "Waiting..."
    document.getElementById("ivValue").textContent = "Generating..."
    document.getElementById("encryptedBytes").textContent = "Processing..."
    document.getElementById("finalOutput").textContent = "Processing..."
  }

  resetRSAVisualization() {
    // Reset all RSA steps
    const steps = ["input", "key", "encrypt", "output"]
    steps.forEach((step) => {
      const stepElement = document.getElementById(`rsa-step-${step.id}`)
      const statusElement = document.getElementById(`rsa-status-${step.id}`)

      stepElement.classList.remove("active", "completed")
      statusElement.textContent = "⏳"
    })

    // Reset connectors
    document.querySelectorAll(".flow-connector").forEach((connector) => {
      connector.classList.remove("active")
    })

    // Reset data values
    document.getElementById("rsaInputValue").textContent = "Waiting..."
    document.getElementById("rsaModulus").textContent = "Loading..."
    document.getElementById("rsaFinalOutput").textContent = "Processing..."
  }

  async animateSymmetricEncryption(inputText, algorithm, result) {
    const steps = [
      { id: "input", delay: 500 },
      { id: "padding", delay: 800 },
      { id: "key", delay: 600 },
      { id: "encrypt", delay: 1200 },
      { id: "output", delay: 800 },
    ]

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]

      // Activate current step
      const stepElement = document.getElementById(`step-${step.id}`)
      const statusElement = document.getElementById(`status-${step.id}`)

      stepElement.classList.add("active")
      statusElement.textContent = "⚙️"

      // Activate connector to next step
      if (i < steps.length - 1) {
        const connectors = document.querySelectorAll(".flow-connector")
        if (connectors[i]) {
          connectors[i].classList.add("active")
        }
      }

      // Update step content
      await this.updateStepContent(step.id, inputText, algorithm, result)

      // Wait for step delay
      await this.delay(step.delay)

      // Mark as completed
      stepElement.classList.remove("active")
      stepElement.classList.add("completed")
      statusElement.textContent = "✅"
    }

    // Show summary
    this.showProcessSummary(algorithm)
  }

  async animateRSAEncryption(inputText, result) {
    const steps = [
      { id: "input", delay: 500 },
      { id: "key", delay: 800 },
      { id: "encrypt", delay: 1000 },
      { id: "output", delay: 600 },
    ]

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]

      // Activate current step
      const stepElement = document.getElementById(`rsa-step-${step.id}`)
      const statusElement = document.getElementById(`rsa-status-${step.id}`)

      stepElement.classList.add("active")
      statusElement.textContent = "⚙️"

      // Activate connector to next step
      if (i < steps.length - 1) {
        const connectors = document.querySelectorAll(".flow-connector")
        if (connectors[i]) {
          connectors[i].classList.add("active")
        }
      }

      // Update step content
      await this.updateRSAStepContent(step.id, inputText, result)

      // Wait for step delay
      await this.delay(step.delay)

      // Mark as completed
      stepElement.classList.remove("active")
      stepElement.classList.add("completed")
      statusElement.textContent = "✅"
    }

    // Show summary
    this.showProcessSummary("RSA")
  }

  async updateStepContent(stepId, inputText, algorithm, result) {
    switch (stepId) {
      case "input":
        await this.typeText("inputTextValue", inputText.length > 50 ? inputText.substring(0, 50) + "..." : inputText)
        break

      case "padding":
        const paddedHex = this.textToHex(inputText).substring(0, 64) + "..."
        await this.typeText("paddedValue", paddedHex)
        break

      case "key":
        // Generate a fake IV for visualization
        const fakeIV = btoa(Math.random().toString(36).substring(2, 18))
        await this.typeText("ivValue", fakeIV)
        break

      case "encrypt":
        const encryptedHex = this.base64ToHex(result.encrypted_text).substring(0, 64) + "..."
        await this.typeText("encryptedBytes", encryptedHex)

        // Animate cipher blocks
        const blocks = document.querySelectorAll(".cipher-block")
        blocks.forEach((block, index) => {
          setTimeout(() => {
            block.style.animation = "block-process 0.5s ease"
          }, index * 200)
        })
        break

      case "output":
        await this.typeText("finalOutput", result.encrypted_text)

        // Update statistics
        document.getElementById("originalSizeViz").textContent = `${result.original_length} bytes`
        document.getElementById("encryptedSizeViz").textContent = `${result.encrypted_length} bytes`
        const expansion = (((result.encrypted_length - result.original_length) / result.original_length) * 100).toFixed(
          1,
        )
        document.getElementById("expansionViz").textContent = `+${expansion}%`
        break
    }
  }

  async updateRSAStepContent(stepId, inputText, result) {
    switch (stepId) {
      case "input":
        await this.typeText("rsaInputValue", inputText.length > 50 ? inputText.substring(0, 50) + "..." : inputText)
        break

      case "key":
        // Simulate RSA modulus (first 32 characters)
        const fakeModulus = "A1B2C3D4E5F6789012345678901234567890ABCD"
        await this.typeText("rsaModulus", fakeModulus)
        break

      case "encrypt":
        // Show formula animation
        const formula = document.querySelector(".formula-display")
        formula.style.animation = "pulse 1s ease-in-out"
        await this.delay(500)
        break

      case "output":
        await this.typeText("rsaFinalOutput", result.encrypted_text)
        break
    }
  }

  async typeText(elementId, text) {
    const element = document.getElementById(elementId)
    element.textContent = ""

    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i]
      await this.delay(20) // Typing speed
    }
  }

  textToHex(text) {
    return Array.from(text)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  }

  base64ToHex(base64) {
    try {
      const binary = atob(base64)
      return Array.from(binary)
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    } catch (e) {
      return "48656C6C6F576F726C64" // Fallback hex
    }
  }

  updateTimer() {
    if (this.visualizationStartTime) {
      const elapsed = Date.now() - this.visualizationStartTime
      document.getElementById("processTimer").textContent = `${elapsed}ms`

      if (document.getElementById("liveProcessContainer").style.display !== "none") {
        setTimeout(() => this.updateTimer(), 100)
      }
    }
  }

  showProcessSummary(algorithm) {
    const summary = document.getElementById("processSummary")
    const totalTime = Date.now() - this.visualizationStartTime

    document.getElementById("totalTime").textContent = `${totalTime}ms`
    document.getElementById("summaryAlgorithm").textContent = algorithm

    summary.style.display = "block"
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async encryptText() {
    if (!this.isAuthenticated) {
      this.showEnhancedStatus("🔒 Please authenticate first", "error", "Access Denied")
      return
    }

    const text = document.getElementById("textInput").value.trim()
    const algorithm = document.getElementById("textAlgorithm").value

    if (!text) {
      this.showEnhancedStatus("Please enter text to encrypt", "error", "Input Required")
      return
    }

    if (algorithm === "RSA" && text.length > 200) {
      this.showEnhancedStatus("RSA can only encrypt small text (max ~200 characters)", "error", "Size Limit Exceeded")
      return
    }

    try {
      this.processingStartTime = Date.now()

      // Show live visualization
      this.showLiveVisualization(algorithm, false)

      // Start the encryption process
      this.showProgress(true, "Encrypting text...")
      this.updateVisualization("input", text)

      const response = await fetch("/encrypt-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          algorithm: algorithm,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Start live animation
        if (algorithm === "RSA") {
          await this.animateRSAEncryption(text, result)
        } else {
          await this.animateSymmetricEncryption(text, algorithm, result)
        }

        document.getElementById("textOutput").value = result.encrypted_text
        this.updateVisualization("output", result.encrypted_text)

        // Update statistics
        document.getElementById("originalSize").textContent = `${result.original_length} bytes`
        document.getElementById("encryptedSize").textContent = `${result.encrypted_length} bytes`
        const expansion = (((result.encrypted_length - result.original_length) / result.original_length) * 100).toFixed(
          1,
        )
        document.getElementById("expansionRatio").textContent = `+${expansion}%`

        this.showEnhancedStatus(`✅ Text encrypted successfully using ${algorithm}`, "success", "Encryption Complete")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      this.showEnhancedStatus(`❌ Encryption failed: ${error.message}`, "error", "Encryption Failed")
    } finally {
      this.showProgress(false)
    }
  }

  async decryptText() {
    if (!this.isAuthenticated) {
      this.showEnhancedStatus("🔒 Please authenticate first", "error", "Access Denied")
      return
    }

    const text = document.getElementById("textInput").value.trim()
    const algorithm = document.getElementById("textAlgorithm").value

    if (!text) {
      this.showEnhancedStatus("Please enter ciphertext to decrypt", "error", "Input Required")
      return
    }

    try {
      this.processingStartTime = Date.now()

      // Show live visualization
      this.showLiveVisualization(algorithm, true)

      this.showProgress(true, "Decrypting text...")
      this.updateVisualization("input", text)

      const response = await fetch("/decrypt-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          algorithm: algorithm,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Start live animation (reverse process for decryption)
        if (algorithm === "RSA") {
          await this.animateRSAEncryption(text, result) // Same animation for RSA
        } else {
          await this.animateSymmetricEncryption(text, algorithm, result)
        }

        document.getElementById("textOutput").value = result.decrypted_text
        this.updateVisualization("output", result.decrypted_text)

        // Update statistics
        document.getElementById("originalSize").textContent = `${result.encrypted_length} bytes`
        document.getElementById("encryptedSize").textContent = `${result.decrypted_length} bytes`
        const reduction = (
          ((result.encrypted_length - result.decrypted_length) / result.encrypted_length) *
          100
        ).toFixed(1)
        document.getElementById("expansionRatio").textContent = `-${reduction}%`

        this.showEnhancedStatus(`✅ Text decrypted successfully using ${algorithm}`, "success", "Decryption Complete")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      this.showEnhancedStatus(`❌ Decryption failed: ${error.message}`, "error", "Decryption Failed")
    } finally {
      this.showProgress(false)
    }
  }

  resetProcessFlow() {
    document.getElementById("inputData").textContent = "Waiting for input..."
    document.getElementById("keyData").textContent = "Key: Ready"
    document.getElementById("algorithmData").textContent = "Algorithm: None"
    document.getElementById("outputData").textContent = "Waiting for processing..."

    document.querySelectorAll(".flow-step").forEach((step) => {
      step.classList.remove("active")
    })
  }

  handleDragOver(e) {
    e.preventDefault()
    document.getElementById("uploadArea").classList.add("dragover")
  }

  handleDragLeave(e) {
    e.preventDefault()
    document.getElementById("uploadArea").classList.remove("dragover")
  }

  handleDrop(e) {
    e.preventDefault()
    document.getElementById("uploadArea").classList.remove("dragover")

    const files = e.dataTransfer.files
    if (files.length > 0) {
      this.handleFileSelect(files[0])
    }
  }

  handleFileSelect(file) {
    if (!file) return

    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      this.showEnhancedStatus("File too large! Maximum size is 500MB", "error", "Size Limit Exceeded")
      return
    }

    this.selectedFile = file

    // Display file information
    document.getElementById("fileName").textContent = file.name
    document.getElementById("fileSize").textContent = this.formatFileSize(file.size)
    document.getElementById("fileType").textContent = file.type || "Unknown"

    // Set appropriate file icon
    const fileIcon = document.getElementById("fileIcon")
    if (file.type.startsWith("image/")) {
      fileIcon.textContent = "🖼️"
    } else if (file.type.startsWith("video/")) {
      fileIcon.textContent = "🎥"
    } else if (file.type.startsWith("audio/")) {
      fileIcon.textContent = "🎵"
    } else if (file.type.includes("pdf")) {
      fileIcon.textContent = "📄"
    } else if (file.type.includes("zip") || file.type.includes("rar")) {
      fileIcon.textContent = "📦"
    } else {
      fileIcon.textContent = "📄"
    }

    document.getElementById("fileInfo").style.display = "block"
    document.getElementById("encryptFileBtn").disabled = false
    document.getElementById("decryptFileBtn").disabled = false

    this.showEnhancedStatus(`📁 File selected: ${file.name}`, "success", "File Ready")
  }

  async encryptFile() {
    if (!this.isAuthenticated) {
      this.showEnhancedStatus("🔒 Please authenticate first", "error", "Access Denied")
      return
    }

    if (!this.selectedFile) {
      this.showEnhancedStatus("Please select a file first", "error", "No File Selected")
      return
    }

    const algorithm = document.getElementById("fileAlgorithm").value

    try {
      this.processingStartTime = Date.now()
      this.showProgress(true, "Encrypting file...")

      const formData = new FormData()
      formData.append("file", this.selectedFile)
      formData.append("algorithm", algorithm)

      const response = await fetch("/encrypt-file", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        this.lastOperation = {
          type: "encrypt",
          filename: result.encrypted_filename,
          originalFilename: result.original_filename,
          algorithm: result.algorithm,
        }

        const processingTime = ((Date.now() - this.processingStartTime) / 1000).toFixed(1)
        const sizeChange = result.compression_ratio - 100

        document.getElementById("resultTitle").textContent = "File Encrypted Successfully!"
        document.getElementById("resultDescription").textContent =
          `Your file has been encrypted using ${algorithm} algorithm`
        document.getElementById("processingTime").textContent = `${processingTime}s`
        document.getElementById("sizeChange").textContent = `${sizeChange > 0 ? "+" : ""}${sizeChange.toFixed(1)}%`
        document.getElementById("resultSection").style.display = "block"
        document.getElementById("resultSection").classList.add("show")

        this.showEnhancedStatus(`✅ File encrypted successfully using ${algorithm}`, "success", "Encryption Complete")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      this.showEnhancedStatus(`❌ File encryption failed: ${error.message}`, "error", "Encryption Failed")
    } finally {
      this.showProgress(false)
    }
  }

  async decryptFile() {
    if (!this.isAuthenticated) {
      this.showEnhancedStatus("🔒 Please authenticate first", "error", "Access Denied")
      return
    }

    if (!this.selectedFile) {
      this.showEnhancedStatus("Please select an encrypted file first", "error", "No File Selected")
      return
    }

    const algorithm = document.getElementById("fileAlgorithm").value

    try {
      this.processingStartTime = Date.now()
      this.showProgress(true, "Decrypting file...")

      const formData = new FormData()
      formData.append("file", this.selectedFile)
      formData.append("algorithm", algorithm)
      formData.append("original_filename", this.selectedFile.name.replace(".enc", ""))

      const response = await fetch("/decrypt-file", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        this.lastOperation = {
          type: "decrypt",
          filename: result.decrypted_filename,
          algorithm: result.algorithm,
        }

        const processingTime = ((Date.now() - this.processingStartTime) / 1000).toFixed(1)
        const sizeChange = ((result.file_size - result.encrypted_size) / result.encrypted_size) * 100

        document.getElementById("resultTitle").textContent = "File Decrypted Successfully!"
        document.getElementById("resultDescription").textContent =
          `Your file has been decrypted using ${algorithm} algorithm`
        document.getElementById("processingTime").textContent = `${processingTime}s`
        document.getElementById("sizeChange").textContent = `${sizeChange > 0 ? "+" : ""}${sizeChange.toFixed(1)}%`
        document.getElementById("resultSection").style.display = "block"
        document.getElementById("resultSection").classList.add("show")

        this.showEnhancedStatus(`✅ File decrypted successfully using ${algorithm}`, "success", "Decryption Complete")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      this.showEnhancedStatus(`❌ File decryption failed: ${error.message}`, "error", "Decryption Failed")
    } finally {
      this.showProgress(false)
    }
  }

  clearFile() {
    this.selectedFile = null
    document.getElementById("fileInfo").style.display = "none"
    document.getElementById("resultSection").style.display = "none"
    document.getElementById("resultSection").classList.remove("show")
    document.getElementById("encryptFileBtn").disabled = true
    document.getElementById("decryptFileBtn").disabled = true
    document.getElementById("fileInput").value = ""
    this.showEnhancedStatus("File selection cleared", "success", "Reset Complete")
  }

  downloadResult() {
    if (!this.lastOperation) {
      this.showEnhancedStatus("No file to download", "error", "Download Failed")
      return
    }

    const folder = this.lastOperation.type === "encrypt" ? "encrypted" : "decrypted"
    const filename = this.lastOperation.filename

    const downloadUrl = `/download/${folder}/${filename}`

    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    this.showEnhancedStatus("⬇️ Download started", "success", "Download Initiated")
  }

  checkRSALimitation() {
    const algorithm = document.getElementById("textAlgorithm").value
    const textInput = document.getElementById("textInput")

    if (algorithm === "RSA") {
      textInput.placeholder = "Enter small text (RSA limitation: ~200 characters max)"
    } else {
      textInput.placeholder = "Enter your text here..."
    }
  }

  showProgress(show, message = "Processing...") {
    const progressSection = document.getElementById("progressSection")
    const progressFill = document.getElementById("progressFill")
    const progressTitle = document.getElementById("progressTitle")
    const progressPercent = document.getElementById("progressPercent")
    const progressStatus = document.getElementById("progressStatus")

    if (show) {
      progressSection.style.display = "block"
      progressTitle.textContent = message
      progressStatus.textContent = "Initializing..."

      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress > 90) progress = 90

        progressFill.style.width = progress + "%"
        progressPercent.textContent = Math.round(progress) + "%"

        if (progress < 30) {
          progressStatus.textContent = "Reading data..."
        } else if (progress < 60) {
          progressStatus.textContent = "Processing encryption..."
        } else {
          progressStatus.textContent = "Finalizing..."
        }
      }, 300)

      this.progressInterval = interval
    } else {
      if (this.progressInterval) {
        clearInterval(this.progressInterval)
      }
      progressFill.style.width = "100%"
      progressPercent.textContent = "100%"
      progressStatus.textContent = "Complete!"

      setTimeout(() => {
        progressSection.style.display = "none"
      }, 1000)
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  showEnhancedStatus(message, type, title = "") {
    const toast = document.getElementById("statusToast")
    const icon = document.getElementById("toastIcon")
    const titleEl = document.getElementById("toastTitle")
    const messageEl = document.getElementById("toastMessage")

    if (type === "success") {
      icon.textContent = "✅"
      icon.className = "toast-icon success"
    } else {
      icon.textContent = "❌"
      icon.className = "toast-icon error"
    }

    titleEl.textContent = title || (type === "success" ? "Success" : "Error")
    messageEl.textContent = message

    toast.style.display = "flex"

    setTimeout(() => {
      toast.style.display = "none"
    }, 4000)
  }
}

// Initialize the crypto system when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new CryptoSystem()
  console.log("🔐 Advanced Cryptographic Visualization System initialized")
  console.log("🔑 Master Key: sumantra")
})
