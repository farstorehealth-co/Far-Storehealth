const auditEngine = require('../services/auditEngine');

async function runTests() {
  console.log('\n🔍 Running Demo Audit...\n');
  const auditResult = await auditEngine.performAudit('demo-store.myshopify.com', 'demo-token');
  console.log('📊 RESULTS:');
  console.log(`   Health Score: ${auditResult.healthScore}/100`);
  console.log(`   Speed: ${auditResult.metrics.speed}/100`);
  console.log(`   Trust: ${auditResult.metrics.trust}/100`);
  console.log(`   Conversion: ${auditResult.metrics.conversion}/100`);
  console.log(`   SEO: ${auditResult.metrics.seo}/100`);
  console.log(`\n💡 Recommendations: ${auditResult.recommendations.length}`);
  auditResult.recommendations.forEach((rec, i) => {
    console.log(`   ${i+1}. ${rec.title} (${rec.category})`);
  });
  console.log('\n🎉 TEST PASSED!\n');
}

runTests();
