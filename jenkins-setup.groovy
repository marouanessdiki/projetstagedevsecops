// Jenkins setup script for monitoring
import jenkins.model.*
import hudson.model.*
import hudson.security.*

// Install Prometheus plugin
def pluginManager = Jenkins.instance.pluginManager
def prometheusPlugin = pluginManager.getPlugin('prometheus')
if (prometheusPlugin == null) {
    println "Installing Prometheus plugin..."
    pluginManager.install('prometheus', true)
    Jenkins.instance.save()
    println "Prometheus plugin installed successfully"
} else {
    println "Prometheus plugin already installed"
}

// Configure Prometheus metrics
def prometheusConfig = Jenkins.instance.getDescriptor('io.prometheus.jenkins.PrometheusConfiguration')
if (prometheusConfig != null) {
    prometheusConfig.setCollectingMetricsPeriodInSeconds(10)
    prometheusConfig.setEnableAuthenticatedAccess(false)
    prometheusConfig.setEnableInjectedMetrics(true)
    prometheusConfig.setEnableJvmMetrics(true)
    prometheusConfig.setEnableJenkinsMetrics(true)
    prometheusConfig.setEnableNodeMetrics(true)
    prometheusConfig.setEnableJobMetrics(true)
    prometheusConfig.setEnableHealthCheck(true)
    prometheusConfig.save()
    println "Prometheus configuration updated"
}

// Restart Jenkins to apply changes
Jenkins.instance.save()
println "Jenkins configuration completed. Please restart Jenkins to apply changes."
